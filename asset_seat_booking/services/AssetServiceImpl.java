package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.Asset;
import com.example.asset_seat_booking.entity.AssetStatus;
import com.example.asset_seat_booking.repositry.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;

    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }



    @Override
    public Asset updateAsset(Long id, Asset asset) {
        Asset existingAsset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        existingAsset.setSerial(asset.getSerial());
        existingAsset.setStatus(asset.getStatus());
        existingAsset.setQuantity(asset.getQuantity());

        return assetRepository.save(existingAsset);
    }



    @Override
    public void deleteAsset(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        asset.setStatus(AssetStatus.UNAVAILABLE);
        assetRepository.save(asset);
    }


    @Override
    public Asset increaseQuantity(Long id, int count) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        asset.setQuantity(asset.getQuantity() + count);
        return assetRepository.save(asset);
    }

    @Override
    public Asset decreaseQuantity(Long id, int count) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        if (asset.getQuantity() < count) {
            throw new RuntimeException("Not enough asset quantity");
        }

        asset.setQuantity(asset.getQuantity() - count);
        return assetRepository.save(asset);
    }

    @Override
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @Override
    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }
}
