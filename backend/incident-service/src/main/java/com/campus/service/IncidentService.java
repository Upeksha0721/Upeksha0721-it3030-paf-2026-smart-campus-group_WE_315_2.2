package com.campus.service;

import com.campus.dto.*;
import com.campus.model.*;
import com.campus.repository.AttachmentRepository;
import com.campus.repository.CommentRepository;
import com.campus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    public TicketDTO createTicket(TicketRequest request, String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new RuntimeException("User email is required for ticket creation");
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

        return mapToDTO(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketDTO assignTechnician(Long id, String technicianId, String role) {
        if (!"ROLE_ADMIN".equals(role)) {
            throw new RuntimeException("Only admins can assign technicians");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTechnicianId(technicianId);
        return mapToDTO(ticketRepository.save(ticket));
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

        return mapToCommentDTO(commentRepository.save(comment));
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
}
