package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {

    List<AssetAssignment> findByUser_Id(Long userId);
}