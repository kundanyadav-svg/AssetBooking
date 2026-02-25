package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long> {

    List<AssetAssignment> findByUser_Id(Long userId);
    Optional<AssetAssignment> findByAsset_IdAndUser_Id(Long assetId, Long userId);

}