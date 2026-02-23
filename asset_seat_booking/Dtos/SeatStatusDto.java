package com.example.asset_seat_booking.Dtos;



public class SeatStatusDto {


      private int seatNo;
      private boolean booked;



    public SeatStatusDto(int seatNo, boolean booked) {
        this.seatNo = seatNo;
        this.booked = booked;
    }

    public int getSeatNo() {
        return seatNo;
    }

    public boolean isBooked() {
        return booked;
    }
}
