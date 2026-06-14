package com.BankSystem.bankproject.controller;

import com.BankSystem.bankproject.dto.response.AccountResponse;
import com.BankSystem.bankproject.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<?> createAccount(@RequestParam String type){
        return new ResponseEntity<>(accountService.createAccount(type), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccounts(){
        try {
            return new ResponseEntity<>(accountService.getUserAccounts(),HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error occurred: ",e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/balance/{id}")
    public ResponseEntity<?> getBalance(@PathVariable Long id){
        return new ResponseEntity<>(accountService.getBalance(id),HttpStatus.OK);
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable Long id){
        return new ResponseEntity<>(accountService.getAccount(id),HttpStatus.OK);
    }
}
