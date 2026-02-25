package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.ExcepionHnadle.ResourceNotFoundException;
import com.example.asset_seat_booking.entity.*;
import com.example.asset_seat_booking.repositry.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final AssetAssignmentRepository assignmentRepo;

    public RequestServiceImpl(RequestRepository requestRepository,
                              UserRepository userRepository,
                              AssetRepository assetRepository,  AssetAssignmentRepository assignmentRepo) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.assignmentRepo = assignmentRepo;

    }




    // USER creates request

    @Override
    public Request createUserRequest(Long userId, Long assetId, int requestedQuantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // FIX: Check if total requested quantity exceeds available stock
        if (asset.getQuantity() < requestedQuantity) {
            throw new RuntimeException("Requested quantity (" + requestedQuantity +
                    ") exceeds available stock (" + asset.getQuantity() + ")");
        }

        Request request = new Request();
        request.setUser(user);
        request.setAsset(asset);
        request.setItem(asset.getName());
        request.setQuantity(requestedQuantity);
        request.setRequestStatus(RequestStatus.DRAFT);
        request.setRequestType(RequestType.USER_REQUEST);

        return requestRepository.save(request);
    }



    // IT_SUPPORT view pending
    @Override
    public List<Request> getPendingRequests() {
        return requestRepository.findByRequestStatus(RequestStatus.DRAFT);
    }





    // IT_SUPPORT approves
//    @Override
//    @Transactional
//    public Request approveRequest(Long requestId) {
//
//        Request request = requestRepository.findById(requestId)
//                .orElseThrow(() -> new RuntimeException("Request not found"));
//
//        if (request.getRequestStatus() != RequestStatus.DRAFT) {
//            throw new RuntimeException("Request already processed");
//        }
//
//        Asset asset = request.getAsset();
//
//        if (asset.getQuantity() <= 0) {
//            throw new RuntimeException("Asset out of stock");
//        }
//
//        // assign asset to user
//        asset.setOwner(request.getUser());
//        asset.setQuantity(asset.getQuantity() - 1);
//
//        request.setRequestStatus(RequestStatus.APPROVE);
//
//        assetRepository.save(asset);
//        return requestRepository.save(request);
//    }




    // IT_SUPPORT rejects
    @Override
    public Request rejectRequest(Long requestId) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setRequestStatus(RequestStatus.REJECTE);

        return requestRepository.save(request);
    }





    // User view own requests
    @Override
    public List<Request> getRequestsByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch requests
        List<Request> requests = requestRepository.findByUser_Id(userId);


        if (requests.isEmpty()) {
            throw new ResourceNotFoundException("No requests found for user ID: " + userId);
        }

        return requests;
    }





    @Transactional
    public void createSystemRequestForBrokenAsset(Long assignmentId, Long userId, int brokenCount) {
        AssetAssignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (brokenCount > assignment.getQuantity()) {
            throw new RuntimeException("Cannot report more items broken than assigned");
        }

        Asset asset = assignment.getAsset();


           if(asset.getQuantity() < brokenCount) {
            throw new RuntimeException("Not enough stock to replace broken items. Available: " + asset.getQuantity() + ", Broken: " + brokenCount);
        }

        // If only some items are broken, reduce the quantity of the current assignment
        if (brokenCount < assignment.getQuantity()) {
            assignment.setQuantity(assignment.getQuantity() - brokenCount);
        } else {
            // If all are broken, mark the whole assignment status
            assignment.setStatus(AssetStatus.BROKEN);
        }

        // Create a new SYSTEM_GENERATED request for the broken quantity
        Request brokenRequest = new Request();
        brokenRequest.setAsset(asset);
        brokenRequest.setUser(assignment.getUser());
        brokenRequest.setItem(asset.getName());
        brokenRequest.setQuantity(brokenCount); // Request replacement for specific amount
        brokenRequest.setRequestType(RequestType.SYSTEM_GENERATED);
        brokenRequest.setRequestStatus(RequestStatus.DRAFT);

        requestRepository.save(brokenRequest);
        assignmentRepo.save(assignment);
    }



    // src/main/java/com/example/asset_seat_booking/services/RequestServiceImpl.java

    @Override
    @Transactional
    public Request changeRequestStatus(Long requestId, RequestStatus status) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (status == RequestStatus.ASSIGNE) {
            Asset asset = request.getAsset();
            int requestedQty = (request.getQuantity() > 0) ? request.getQuantity() : 1;

            if (asset.getQuantity() < requestedQty) {
                throw new RuntimeException("Insufficient stock available");
            }

            // Decrease central asset quantity
            asset.setQuantity(asset.getQuantity() - requestedQty);
            if (asset.getQuantity() == 0) {
                asset.setStatus(AssetStatus.UNAVAILABLE);
            }
            assetRepository.save(asset);

            // FIX: Check if the user already has an assignment for this asset
            Optional<AssetAssignment> existingAssignment = assignmentRepo
                    .findByAsset_IdAndUser_Id(asset.getId(), request.getUser().getId());

            if (existingAssignment.isPresent()) {
                // Update existing assignment quantity instead of inserting new row
                AssetAssignment assignment = existingAssignment.get();
                assignment.setQuantity(assignment.getQuantity() + requestedQty);
                assignment.setStatus(AssetStatus.BOOKED); // Ensure status is active
                assignmentRepo.save(assignment);
            } else {
                // Create brand new assignment if none exists
                AssetAssignment assignment = new AssetAssignment();
                assignment.setUser(request.getUser());
                assignment.setAsset(asset);
                assignment.setQuantity(requestedQty);
                assignment.setStatus(AssetStatus.BOOKED);
                assignment.setAssignedDate(LocalDate.now());
                assignmentRepo.save(assignment);
            }

            request.setRequestStatus(RequestStatus.ASSIGNE);
        } else {
            request.setRequestStatus(status);
        }

        return requestRepository.save(request);
    }



        @Override
        public List<Request> getAllRequests(RequestType requestType) {

           Request request= (Request) requestRepository.findByRequestType(requestType);

               if(request==null){
                   throw new ResourceNotFoundException("No requests found for type: " + requestType);
               }


                return requestRepository.findByRequestType(requestType);

        }


        @Override
        public Page<Request> getAllRequestsPaginated(int page, int size) {

            Pageable pageable= Pageable.ofSize(size).withPage(page);

            return  requestRepository.findAll(pageable);
        }




}
