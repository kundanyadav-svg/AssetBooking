package com.example.asset_seat_booking.controller;

import com.example.asset_seat_booking.entity.Asset;
import com.example.asset_seat_booking.entity.AssetStatus;
import com.example.asset_seat_booking.services.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:5173" ,allowCredentials = "true")
@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService service;

    public AssetController(AssetService service) {
        this.service = service;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<Asset> addAsset(@RequestBody Asset asset) {
        return ResponseEntity.ok(service.addAsset(asset));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id,
                                             @RequestBody Asset asset) {
        return ResponseEntity.ok(service.updateAsset(id, asset));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id) {
        service.deleteAsset(id);
        return ResponseEntity.ok("Asset deleted successfully");
    }



    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/increase/{id}")
    public ResponseEntity<Asset> increaseQuantity(@PathVariable Long id,
                                                  @RequestParam int count) {
        return ResponseEntity.ok(service.increaseQuantity(id, count));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/decrease/{id}")
    public ResponseEntity<Asset> decreaseQuantity(@PathVariable Long id,
                                                  @RequestParam int count) {
        return ResponseEntity.ok(service.decreaseQuantity(id, count));
    }



    @GetMapping("/all")
    public ResponseEntity<?> getAllAssets() {
        return ResponseEntity.ok(service.getAllAssets());
    }





    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAssetById(id));
    }




      @PostMapping("/update-status/{id}")
      public ResponseEntity<Asset> updateStatus(@PathVariable Long id,
                                              @RequestParam String status) {
         Asset asset = service.getAssetById(id);
         asset.setStatus(AssetStatus.valueOf(status));
         return ResponseEntity.ok(service.updateAsset(id, asset));

     }



}
