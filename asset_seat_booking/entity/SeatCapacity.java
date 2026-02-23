package com.example.asset_seat_booking.entity;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "seat_capacity",
        uniqueConstraints = @UniqueConstraint(columnNames = {"date"}))
public class SeatCapacity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private LocalDate date;



    @Column(nullable = false)
    private int totalSeats;   // admin increases/decreases this


    public SeatCapacity() {}




    public SeatCapacity(LocalDate date, int totalSeats) {
        this.date = date;
        this.totalSeats = totalSeats;
    }




    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }




}
