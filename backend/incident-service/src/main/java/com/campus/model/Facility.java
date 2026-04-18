package com.campus.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "facilities")
@Data
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // e.g. Lab A, Room 101
    private String type;          // e.g. LAB, CLASSROOM
    private String location;
    private int capacity;
    private boolean available = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}