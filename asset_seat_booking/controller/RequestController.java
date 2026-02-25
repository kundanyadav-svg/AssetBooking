package com.example.asset_seat_booking.controller;

import com.example.asset_seat_booking.entity.AssetStatus;
import com.example.asset_seat_booking.entity.Booking;
import com.example.asset_seat_booking.entity.Request;
import com.example.asset_seat_booking.entity.RequestStatus;
import com.example.asset_seat_booking.services.RequestService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true")
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService service;

    public RequestController(RequestService service) {
        this.service = service;
    }



    // USER creates request
    @PostMapping("/create")
    public Request createRequest(@RequestParam Long userId,
                                 @RequestParam Long assetId,
                                 @RequestParam int quantity) {
        return service.createUserRequest(userId, assetId, quantity);
    }





    // IT_SUPPORT view pending
    @GetMapping("/pending")
    public List<Request> getPending() {
        return service.getPendingRequests();
    }





//    // IT_SUPPORT approve
//    @PutMapping("/{id}/approve")
//    public Request approve(@PathVariable Long id) {
//        return service.approveRequest(id);
//    }




    // IT_SUPPORT reject
    @PutMapping("/{id}/reject")
    public Request reject(@PathVariable Long id) {
        return service.rejectRequest(id);
    }




    // USER see own requests
    @GetMapping("/user/{userId}")
    public List<Request> getUserRequests(@PathVariable Long userId) {
        return service.getRequestsByUser(userId);
    }




    @PostMapping("/system/{assignmentId}/{userId}/{brokenCount}")
    public ResponseEntity<Request> createSystemRequest(
            @PathVariable Long assignmentId,
            @PathVariable Long userId,
            @PathVariable int brokenCount
        ) {

        service.createSystemRequestForBrokenAsset(assignmentId,userId,brokenCount);
        return ResponseEntity.ok().build();
    }


        @PutMapping("/{id}/status")
        @PreAuthorize("hasRole('ITSUPPORT')")
        public ResponseEntity<Request> changeStatus(
                @PathVariable Long id,
                @RequestParam RequestStatus status) {

            return ResponseEntity.ok(service.changeRequestStatus(id, status));
        }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ITSUPPORT')")
    public ResponseEntity<Page<Request>> getAll(
            @RequestParam int page,
            @RequestParam int size
    ) {

        Page<Request> result = service.getAllRequestsPaginated(page, size);
        return ResponseEntity.ok(result);
    }




    }


