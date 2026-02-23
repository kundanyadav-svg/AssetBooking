package com.example.asset_seat_booking.entity;
import jakarta.persistence.*;



@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private String item;




       //DRAFT-->PENDING_APPROVAL-->Rejected
       @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private RequestStatus requestStatus;



    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType requestType;



    // Many requests belong to one user who created the request
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;





    // Many requests can be related to one asset (broken asset)
    @ManyToOne
    @JoinColumn(name = "asset_id")
    private Asset asset;





    public Request() {}

    public Request(String item, RequestStatus requestStatus, RequestType requestType,
                   User user, Asset asset) {
        this.item = item;
        this.requestStatus = requestStatus;
        this.requestType = requestType;
        this.user = user;
        this.asset = asset;
    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }



    public RequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(RequestType requestType) {
        this.requestType = requestType;
    }

    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }

    public Asset getAsset() {
        return asset;
    }


    public void setAsset(Asset asset) {
        this.asset = asset;
    }


    public RequestStatus getRequestStatus() {
        return requestStatus;
    }


    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
    }






}
