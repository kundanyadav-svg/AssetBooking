package com.example.asset_seat_booking.services;


import com.example.asset_seat_booking.entity.AssetAssignment;
import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.repositry.AssetAssignmentRepository;
import com.example.asset_seat_booking.repositry.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetAssignmentServiceImpl implements  AssetAssignmentService {

        private final AssetAssignmentRepository assetAssignmentRepository;
        private final UserRepository userRepository;

    public AssetAssignmentServiceImpl(AssetAssignmentRepository assetAssignmentRepository, UserRepository userRepository) {
        this.assetAssignmentRepository = assetAssignmentRepository;
        this.userRepository = userRepository;
    }


    @Override
    public List<AssetAssignment> getAssignmentsForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return assetAssignmentRepository.findByUser_Id(user.getId());
    }



}
