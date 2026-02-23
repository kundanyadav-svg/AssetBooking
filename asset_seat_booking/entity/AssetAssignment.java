package com.example.asset_seat_booking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "asset_assignments",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"asset_id", "user_id"})
        }
)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class AssetAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    // Many assignments can belong to one asset
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;




    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status;   // ASSIGNED, BROKEN, RETURNED



    @Column(nullable = false)
    private LocalDate assignedDate;



    public AssetAssignment() {}

    public AssetAssignment(Asset asset, User user, AssetStatus status) {
        this.asset = asset;
        this.user = user;
        this.status = status;
        this.assignedDate = LocalDate.now();
    }



    // ---------- Getters & Setters ----------

    public Long getId() {
        return id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

    public void setAssignedAt(LocalDateTime now) {
        this.assignedDate = now.toLocalDate();
    }
}
