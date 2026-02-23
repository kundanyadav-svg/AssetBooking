package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.AssetStatus;
import com.example.asset_seat_booking.entity.Request;
import com.example.asset_seat_booking.entity.RequestStatus;
import com.example.asset_seat_booking.entity.RequestType;
import org.springframework.data.domain.Page;

import java.util.List;


public interface RequestService {

    Request createUserRequest(Long userId, Long assetId);

    List<Request> getPendingRequests();

//    Request approveRequest(Long requestId);

    Request rejectRequest(Long requestId);

    List<Request> getRequestsByUser(Long userId);

    void createSystemRequestForBrokenAsset(Long assignmentId, Long userId);


    Request changeRequestStatus(Long requestId, RequestStatus status);

     List<Request> getAllRequests(RequestType requestType);

     Page<Request> getAllRequestsPaginated(int page, int size);


}
