package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.AssetAssignment;

import java.util.List;

public interface AssetAssignmentService {

    List<AssetAssignment> getAssignmentsForUser(String email);
}
