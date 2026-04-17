package com.campus.dto;

import java.util.Map;

public class TicketSummaryDTO {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long rejectedTickets;
    private Map<String, Long> categoryDistribution;

    public TicketSummaryDTO() {
    }

    public TicketSummaryDTO(long totalTickets, long openTickets, long inProgressTickets,
                            long resolvedTickets, long closedTickets, long rejectedTickets,
                            Map<String, Long> categoryDistribution) {
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
        this.closedTickets = closedTickets;
        this.rejectedTickets = rejectedTickets;
        this.categoryDistribution = categoryDistribution;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(long openTickets) {
        this.openTickets = openTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(long resolvedTickets) {
        this.resolvedTickets = resolvedTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(long closedTickets) {
        this.closedTickets = closedTickets;
    }

    public long getRejectedTickets() {
        return rejectedTickets;
    }

    public void setRejectedTickets(long rejectedTickets) {
        this.rejectedTickets = rejectedTickets;
    }

    public Map<String, Long> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalTickets;
        private long openTickets;
        private long inProgressTickets;
        private long resolvedTickets;
        private long closedTickets;
        private long rejectedTickets;
        private Map<String, Long> categoryDistribution;

        public Builder totalTickets(long totalTickets) {
            this.totalTickets = totalTickets;
            return this;
        }

        public Builder openTickets(long openTickets) {
            this.openTickets = openTickets;
            return this;
        }

        public Builder inProgressTickets(long inProgressTickets) {
            this.inProgressTickets = inProgressTickets;
            return this;
        }

        public Builder resolvedTickets(long resolvedTickets) {
            this.resolvedTickets = resolvedTickets;
            return this;
        }

        public Builder closedTickets(long closedTickets) {
            this.closedTickets = closedTickets;
            return this;
        }

        public Builder rejectedTickets(long rejectedTickets) {
            this.rejectedTickets = rejectedTickets;
            return this;
        }

        public Builder categoryDistribution(Map<String, Long> categoryDistribution) {
            this.categoryDistribution = categoryDistribution;
            return this;
        }

        public TicketSummaryDTO build() {
            return new TicketSummaryDTO(totalTickets, openTickets, inProgressTickets,
                    resolvedTickets, closedTickets, rejectedTickets, categoryDistribution);
        }
    }
}
