package com.example.asset_seat_booking.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;


@Entity
@Table(name = "assets")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    // unique serial number
    @Column(nullable = false, unique = true)
    private String serial;



    @Column(nullable = false)
    private String name;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status;



    // default quantity = 1
    @Column(nullable = false)
    private int quantity = 1;


    // assets can belong to one user (owner)
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AssetAssignment> assignments;




     // one asset can be related to many requests (broken asset)
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Request> requests;



    public Asset() {}

    public Asset(String serial, String name, AssetStatus status, int quantity) {
        this.serial = serial;
        this.name = name;
        this.status = status;
        this.quantity = quantity;
    }


    public Long getId() {
        return id;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }



      public  List<AssetAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<AssetAssignment> assignments) {
        this.assignments = assignments;
    }


    public List<Request> getRequests() {
        return requests;
    }

    public void setRequests(List<Request> requests) {
        this.requests = requests;
    }
}
