package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.ExcepionHnadle.ResourceNotFoundException;
import com.example.asset_seat_booking.entity.*;
import com.example.asset_seat_booking.repositry.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

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
    public Request createUserRequest(Long userId, Long assetId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (asset.getQuantity() <= 0) {
            throw new RuntimeException("Asset not available");
        }

        Request request = new Request();
        request.setUser(user);
        request.setAsset(asset);
        request.setItem(asset.getSerial());
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
    public void createSystemRequestForBrokenAsset(Long assignmentId, Long userId) {

        AssetAssignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (!assignment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only mark your own asset broken");
        }

        if (assignment.getStatus() == AssetStatus.BROKEN) {
            throw new RuntimeException("Already marked as broken");
        }

        Asset asset = assignment.getAsset();


        assignment.setStatus(AssetStatus.BROKEN);


        if (asset.getQuantity() <= 0) {
            throw new RuntimeException("No quantity left");
        }

        asset.setQuantity(asset.getQuantity() - 1);


        if (asset.getQuantity() == 0) {
            asset.setStatus(AssetStatus.UNAVAILABLE);
        }

        assetRepository.save(asset);
        assignmentRepo.save(assignment);


        Optional<Request> existing =
                requestRepository.findByAsset_IdAndUser_IdAndRequestTypeAndRequestStatus(
                        asset.getId(),
                        userId,
                        RequestType.SYSTEM_GENERATED,
                        RequestStatus.DRAFT
                );

        if (existing.isPresent()) {
            throw new RuntimeException("Broken request already generated");
        }


        Request request = new Request();
        request.setAsset(asset);
        request.setUser(assignment.getUser());
        request.setItem(asset.getName());
        request.setRequestType(RequestType.SYSTEM_GENERATED);
        request.setRequestStatus(RequestStatus.DRAFT);

        requestRepository.save(request);
    }






    @Override
    @Transactional
    public Request changeRequestStatus(Long requestId, RequestStatus status) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

//        // cannot update rejected request
//        if (request.getRequestStatus() == RequestStatus.REJECTE) {
//            throw new RuntimeException("Rejected request cannot be updated");
//        }



        // only handle assignment when status = ASSIGNE
        if (status == RequestStatus.ASSIGNE) {

            Asset asset = request.getAsset();

            // check availability
            if (asset.getQuantity() <= 0) {
                throw new RuntimeException("Asset is not available");
            }




            // decrease quantity
            asset.setQuantity(asset.getQuantity() - 1);

            // update asset status if empty
            if (asset.getQuantity() == 0) {
                asset.setStatus(AssetStatus.UNAVAILABLE);
            }

            assetRepository.save(asset);

            // create assignment
            AssetAssignment assignment = new AssetAssignment();
            assignment.setUser(request.getUser());
            assignment.setAsset(asset);
            assignment.setStatus(AssetStatus.BOOKED);
            assignment.setAssignedAt(LocalDateTime.now());

            assignmentRepo.save(assignment);

            request.setRequestStatus(RequestStatus.ASSIGNE);
        }
        else {

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
