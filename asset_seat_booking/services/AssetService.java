package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.Asset;

import java.util.List;

public interface AssetService {

    Asset addAsset(Asset asset);

    Asset updateAsset(Long id, Asset asset);

    void deleteAsset(Long id);

    Asset increaseQuantity(Long id, int count);

    Asset decreaseQuantity(Long id, int count);

    List<Asset> getAllAssets();

    Asset getAssetById(Long id);
}
