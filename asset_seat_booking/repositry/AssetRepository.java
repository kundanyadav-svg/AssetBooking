package com.example.asset_seat_booking.repositry;

import com.example.asset_seat_booking.entity.Asset;
import com.example.asset_seat_booking.entity.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {

}