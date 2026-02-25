package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.Booking;
import com.example.asset_seat_booking.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsBySeatNoAndDate(Integer seatNo, LocalDate date);

    boolean existsByUserAndDate(User user, LocalDate date);

    List<Booking> findByDate(LocalDate date);

    Optional<Booking> findByUserAndDate(User user, LocalDate date);


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.seatNo = :seatNo AND b.date = :date")
    Optional<Booking> findBySeatNoAndDateForUpdate(
            @Param("seatNo") Integer seatNo,
            @Param("date") LocalDate date
    );

}
