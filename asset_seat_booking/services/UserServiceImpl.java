package com.example.asset_seat_booking.services;

import com.example.asset_seat_booking.Dtos.SignupRequest;
import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.ExcepionHnadle.UserAlreadyExistsException;
import com.example.asset_seat_booking.repositry.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }



    //creating new user and saving to database
    @Override
    public User registerUser(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }


        User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);



        if (existingUser != null) {
            throw new UserAlreadyExistsException("User already exists");
        }


        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        user.setDept(request.getDept());

        return userRepository.save(user);
    }


    //fetching all user from database
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    //fetching user by email from databse
    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }



}
