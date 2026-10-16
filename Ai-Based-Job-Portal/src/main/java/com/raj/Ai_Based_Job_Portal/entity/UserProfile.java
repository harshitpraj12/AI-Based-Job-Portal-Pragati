package com.raj.Ai_Based_Job_Portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate dob;
    private String address;
    private String mobile;
    private String gender;
//    @OneToMany(mappedBy = "user_profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<String> socialMedia;

}
