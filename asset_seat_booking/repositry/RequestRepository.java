package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.Request;
import com.example.asset_seat_booking.entity.RequestType;
import com.example.asset_seat_booking.entity.RequestStatus;

import com.example.asset_seat_booking.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long> {


    List<Request> findByRequestType(RequestType requestType);

    List<Request> findByRequestStatus(RequestStatus requestStatus);

    List<Request> findByUser_Id(Long userId);


    Optional<Request> findByAsset_IdAndUser_IdAndRequestTypeAndRequestStatus(
            Long assetId,
            Long userId,
            RequestType requestType,
            RequestStatus requestStatus
    );

    Page<Request> findAll(Pageable pageable);
}
