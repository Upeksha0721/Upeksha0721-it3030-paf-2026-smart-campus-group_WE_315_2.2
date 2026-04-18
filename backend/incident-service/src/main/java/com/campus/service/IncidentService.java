package com.campus.service;

import com.campus.dto.CommentRequest;
import com.campus.dto.ReportRequestDTO;
import com.campus.dto.StatusUpdateRequest;
import com.campus.dto.TicketDTO;
import com.campus.dto.TicketRequest;
import com.campus.dto.TicketSummaryDTO;
import com.campus.model.Attachment;
import com.campus.model.Comment;
import com.campus.model.Ticket;
import com.campus.model.TicketStatus;
import com.campus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfWriter;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final RestTemplate restTemplate;

    private static final String AUTH_SERVICE_URL = "http://localhost:8081/api/users/email/";
    private static final String NOTIFICATION_SERVICE_URL = "http://localhost:8086/api/notifications";

    @Transactional
    public TicketDTO createTicket(TicketRequest request, String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("User email is required for ticket creation");
        }

        if (request.getAttachmentUrls() != null && request.getAttachmentUrls().size() > 3) {
            throw new RuntimeException("Maximum 3 image attachments are allowed");
        }

        Ticket ticket = Ticket.builder()
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .status(TicketStatus.OPEN)
                .userId(userId)
                .build();

        if (request.getAttachmentUrls() != null && !request.getAttachmentUrls().isEmpty()) {
            for (String url : request.getAttachmentUrls()) {
                String fileName = url.substring(url.lastIndexOf('/') + 1);
                Attachment attachment = Attachment.builder()
                        .ticket(ticket)
                        .fileName(fileName)
                        .fileUrl(url)
                        .build();
                ticket.getAttachments().add(attachment);
            }
        }

        ticket = ticketRepository.save(ticket);
        return mapToDTO(ticket);
    }

    public List<TicketDTO> getAllTickets(String userId, String role) {
        List<Ticket> tickets;
        if ("ROLE_ADMIN".equals(role)) {
            tickets = ticketRepository.findAll();
        } else if ("ROLE_TECHNICIAN".equals(role)) {
            tickets = ticketRepository.findByAssignedTechnicianId(userId);
        } else {
            tickets = ticketRepository.findByUserId(userId);
        }
        return tickets.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TicketDTO getTicketById(Long id, String userId, String role) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!"ROLE_ADMIN".equals(role) && !"ROLE_TECHNICIAN".equals(role) && !ticket.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return mapToDTO(ticket);
    }

    @Transactional
    public TicketDTO updateStatus(Long id, StatusUpdateRequest request, String userId, String role) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Validation for role-based status changes
        if ("ROLE_ADMIN".equals(role) || ("ROLE_TECHNICIAN".equals(role) && userId.equals(ticket.getAssignedTechnicianId()))) {
            ticket.setStatus(request.getStatus());
            if (request.getStatus() == TicketStatus.REJECTED) {
                ticket.setRejectionReason(request.getReason());
            }
            if (request.getStatus() == TicketStatus.RESOLVED) {
                ticket.setResolutionNotes(request.getResolutionNotes());
            }
        } else {
            throw new RuntimeException("Access denied to update status");
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Notify user about status change
        sendNotification(ticket.getUserId(), "INCIDENT", 
            "The status of your incident #" + ticket.getId() + " (" + ticket.getCategory() + ") has been updated to " + ticket.getStatus());

        return mapToDTO(savedTicket);
    }

    @Transactional
    public TicketDTO assignTechnician(Long id, String technicianId, String role) {
        if (!"ROLE_ADMIN".equals(role)) {
            throw new RuntimeException("Only admins can assign technicians");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTechnicianId(technicianId);
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify technician about assignment
        sendNotification(technicianId, "INCIDENT", 
            "You have been assigned to incident #" + ticket.getId() + " (" + ticket.getCategory() + ")");

        return mapToDTO(savedTicket);
    }

    @Transactional
    public TicketDTO.CommentDTO addComment(Long ticketId, CommentRequest request, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Comment comment = Comment.builder()
                .ticket(ticket)
                .userId(userId)
                .content(request.getContent())
                .build();
        
        Comment savedComment = commentRepository.save(comment);

        // Notify stakeholders (if technician adds, notify user; if user adds, notify technician)
        if (userId.equals(ticket.getUserId())) {
            if (ticket.getAssignedTechnicianId() != null) {
                sendNotification(ticket.getAssignedTechnicianId(), "INCIDENT", 
                    "User added a new comment on ticket #" + ticket.getId());
            }
        } else if (userId.equals(ticket.getAssignedTechnicianId())) {
            sendNotification(ticket.getUserId(), "INCIDENT", 
                "Technician added a new comment on ticket #" + ticket.getId());
        }

        return mapToCommentDTO(savedComment);
    }

    @Transactional
    public TicketDTO.CommentDTO updateComment(Long commentId, CommentRequest request, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Only the owner can edit this comment");
        }

        comment.setContent(request.getContent());
        return mapToCommentDTO(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Only the owner can delete this comment");
        }

        commentRepository.delete(comment);
    }

    private TicketDTO mapToDTO(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .contactDetails(ticket.getContactDetails())
                .status(ticket.getStatus())
                .userId(ticket.getUserId())
                .assignedTechnicianId(ticket.getAssignedTechnicianId())
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .attachments(ticket.getAttachments().stream()
                        .map(a -> new TicketDTO.AttachmentDTO(a.getId(), a.getFileName(), a.getFileUrl()))
                        .collect(Collectors.toList()))
                .comments(ticket.getComments().stream()
                        .map(this::mapToCommentDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private TicketDTO.CommentDTO mapToCommentDTO(Comment comment) {
        return TicketDTO.CommentDTO.builder()
                .id(comment.getId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    public TicketSummaryDTO getTicketSummary() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long rejected = ticketRepository.countByStatus(TicketStatus.REJECTED);

        return TicketSummaryDTO.builder()
                .totalTickets(total)
                .openTickets(open)
                .inProgressTickets(inProgress)
                .resolvedTickets(resolved)
                .closedTickets(closed)
                .rejectedTickets(rejected)
                .build();
    }

    public byte[] generateReport(ReportRequestDTO request) {
        TicketSummaryDTO summary = getTicketSummary();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 50, 50, 60, 60);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, java.awt.Color.DARK_GRAY);
            Paragraph title = new Paragraph("Incident Status Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Summary Statistics", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph(" ", bodyFont));
            
            document.add(new Paragraph("Total Incidents: " + summary.getTotalTickets(), bodyFont));
            document.add(new Paragraph("Open: " + summary.getOpenTickets(), bodyFont));
            document.add(new Paragraph("In Progress: " + summary.getInProgressTickets(), bodyFont));
            document.add(new Paragraph("Resolved: " + summary.getResolvedTickets(), bodyFont));
            document.add(new Paragraph("Closed: " + summary.getClosedTickets(), bodyFont));
            document.add(new Paragraph("Rejected: " + summary.getRejectedTickets(), bodyFont));
            document.add(new Paragraph(" ", bodyFont));

            DefaultPieDataset dataset = new DefaultPieDataset();
            dataset.setValue("Open", summary.getOpenTickets());
            dataset.setValue("In Progress", summary.getInProgressTickets());
            dataset.setValue("Resolved", summary.getResolvedTickets());
            dataset.setValue("Closed", summary.getClosedTickets());
            dataset.setValue("Rejected", summary.getRejectedTickets());

            JFreeChart chart = ChartFactory.createPieChart("Incident Status Distribution", dataset, true, true, false);
            chart.setBackgroundPaint(java.awt.Color.WHITE);

            BufferedImage bufferedImage = chart.createBufferedImage(500, 300);
            ByteArrayOutputStream chartBaos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, "png", chartBaos);
            Image chartImage = Image.getInstance(chartBaos.toByteArray());
            chartImage.setAlignment(Image.ALIGN_CENTER);
            document.add(chartImage);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating report", e);
        }
    }

    private void sendNotification(String email, String type, String message) {
        try {
            // 1. Resolve email to ID via auth-service
            Map<String, Object> user = restTemplate.getForObject(AUTH_SERVICE_URL + email, Map.class);
            if (user != null && user.get("id") != null) {
                Object idObj = user.get("id");
                
                // 2. Send notification
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("userId", idObj.toString());
                requestBody.put("type", type);
                requestBody.put("message", message);
                
                restTemplate.postForObject(NOTIFICATION_SERVICE_URL, requestBody, Map.class);
            }
        } catch (Exception e) {
            // Log error but don't fail the primary transaction
            System.err.println("Failed to send notification to " + email + ": " + e.getMessage());
        }
    }

}
