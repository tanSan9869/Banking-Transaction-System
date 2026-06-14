package com.BankSystem.bankproject.controller;

import com.BankSystem.bankproject.dto.request.DepositWithdrawRequest;
import com.BankSystem.bankproject.dto.request.TransferRequest;
import com.BankSystem.bankproject.dto.response.TransactionResponse;
import com.BankSystem.bankproject.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts/{accountId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@PathVariable Long accountId, @Valid @RequestBody DepositWithdrawRequest request){
        return new ResponseEntity<>(transactionService.deposit(accountId,request), HttpStatus.OK);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@PathVariable Long accountId, @Valid @RequestBody DepositWithdrawRequest request){
        return new ResponseEntity<>(transactionService.withdraw(accountId,request), HttpStatus.OK);
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@PathVariable Long accountId, @Valid @RequestBody TransferRequest request){
        return new ResponseEntity<>(transactionService.transfer(accountId,request), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getHistory(@PathVariable Long accountId){
        return new ResponseEntity<>(transactionService.getHistory(accountId),HttpStatus.OK);
    }

}
