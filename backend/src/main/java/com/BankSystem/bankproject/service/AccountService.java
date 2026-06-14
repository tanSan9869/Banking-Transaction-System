package com.BankSystem.bankproject.service;

import com.BankSystem.bankproject.dto.response.AccountResponse;
import com.BankSystem.bankproject.model.Account;
import com.BankSystem.bankproject.model.User;
import com.BankSystem.bankproject.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AuthService authService;

    public AccountResponse createAccount(String accountType){
        User user = authService.getCurrentUser();

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .user(user)
                .accountNumber(accountNumber)
                .accountType(accountType.toUpperCase())
                .balance(BigDecimal.ZERO)
                .build();

        Account saved = accountRepository.save(account);
        return mapToResponse(saved);
    }

    public List<AccountResponse> getUserAccounts(){
        User user = authService.getCurrentUser();
        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccount(Long accountId){
        Account account = findAndVerifyOwnership(accountId);
        return mapToResponse(account);
    }

    public Account findAndVerifyOwnership(Long accountId) {
        User user = authService.getCurrentUser();
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));

        if(!account.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Unauthorized access to account");
        }

        return account;
    }

    public BigDecimal getBalance(Long accountId){
        Account account = findAndVerifyOwnership(accountId);
        return account.getBalance();
    }

    private String generateAccountNumber() {
        String number;
        do {
            number = "ACC-" + String.format("%06d",(long)(Math.random() * 1_000_000));
        }while(accountRepository.findByAccountNumber(number).isPresent());
        return number;
    }

    public AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .build();
    }

}
