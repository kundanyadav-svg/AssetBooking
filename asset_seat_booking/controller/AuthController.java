package com.example.asset_seat_booking.controller;

import com.example.asset_seat_booking.Dtos.LoginRequest;
import com.example.asset_seat_booking.Dtos.SignupRequest;
import com.example.asset_seat_booking.Security.JwtUtil;


import com.example.asset_seat_booking.repositry.UserRepository;
import com.example.asset_seat_booking.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.asset_seat_booking.entity.User;
import com.example.asset_seat_booking.entity.Roles;






@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController   // ❗ missing in your code
@RequestMapping("/auth")

public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private final UserService userService;


    // Constructor injection
    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil, PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request,
                                        HttpServletResponse response) {


        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );


            UserDetails userDetails = (UserDetails) authentication.getPrincipal();


            String token = jwtUtil.generateToken(userDetails);

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Strict")
                    .maxAge(24 * 60 * 60)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok("Login successful");
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }


    }


    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")  // only admin can register new users
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {

        try {
            Roles.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid role: " + request.getRole());
        }

        userService.registerUser(request);

        System.out.println("Incoming role: " + request.getRole());

        return ResponseEntity.ok("Signup successful");
    }


    // careate admin endpoint
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@RequestBody SignupRequest request) {

//        // Check if admin already exists
//        if (userRepository.findByRole("ROLE_ADMIN").isPresent()) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body("Admin already exists");
//        }

        // Validate role
        if (!request.getRole().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body("Role must be ADMIN");
        }

        User admin = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_ADMIN",
                request.getDept()
        );

        userRepository.save(admin);

        return ResponseEntity.ok("Admin created successfully");
    }





    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User is not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);

    }






    // ==================== LOGOUT ====================
    // Clears the JWT cookie (and also tries to clear JSESSIONID) by setting empty value and maxAge=0
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // clear JWT cookie
        Cookie jwtCookie = new Cookie("jwt", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // true in production
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);


        return ResponseEntity.ok("Logged out successfully");
    }






}
