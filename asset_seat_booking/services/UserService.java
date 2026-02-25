package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.Dtos.SignupRequest;

import java.util.List;

public interface UserService {

    User registerUser(SignupRequest request);

    List<User> getAllUsers();

    User getUserByEmail(String email);
}
