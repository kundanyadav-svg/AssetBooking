package com.example.asset_seat_booking.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(
        name = "bookings",

        uniqueConstraints = {


                // One user can book only one seat per day
                @UniqueConstraint(columnNames = {"user_id", "date"}),



                // One seat can be booked only once per day (prevents double booking)
                @UniqueConstraint(columnNames = {"seat_no", "date"})
        }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    // Seat number (1 to 30)
    @Column(name = "seat_no", nullable = false)
    private Integer seatNo;





    // Booking date
    @Column(nullable = false)
    private LocalDate date;




    // Many bookings belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;




    public Booking() {}



    public Booking(Integer seatNo, LocalDate date, User user) {
        this.seatNo = seatNo;
        this.date = date;
        this.user = user;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeatNo() {
        return seatNo;
    }

    public void setSeatNo(Integer seatNo) {
        this.seatNo = seatNo;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
