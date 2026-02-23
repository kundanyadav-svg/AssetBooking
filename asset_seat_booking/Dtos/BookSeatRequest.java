package com.example.asset_seat_booking.Dtos;

import java.time.LocalDate;

public class BookSeatRequest {

    private Integer seatNo;
    private LocalDate date;


    public BookSeatRequest() {
    }


    public BookSeatRequest(Integer seatNo, LocalDate date) {
        this.seatNo = seatNo;
        this.date = date;
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




}
