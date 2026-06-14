package com.BankSystem.bankproject.service;

import com.BankSystem.bankproject.dto.request.DepositWithdrawRequest;
import com.BankSystem.bankproject.dto.request.TransferRequest;
import com.BankSystem.bankproject.dto.response.TransactionResponse;
import com.BankSystem.bankproject.exception.InsufficientFundsException;
import com.BankSystem.bankproject.model.Account;
import com.BankSystem.bankproject.model.Transaction;
import com.BankSystem.bankproject.repository.AccountRepository;
import com.BankSystem.bankproject.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final AccountRepository accountRepository;

    private final AccountService accountService;

    // ---- DEPOSIT ----
    @Transactional
    public TransactionResponse deposit(Long accountId, DepositWithdrawRequest request){
        Account account = accountService.findAndVerifyOwnership(accountId);

        // Update balance
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        // Record transaction
        Transaction txn = Transaction.builder()
                .account(account)
                .type("DEPOSIT")
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription())
                .build();

        return mapToResponse(transactionRepository.save(txn));
    }

    // ---- WITHDRAW ----
    @Transactional
    public TransactionResponse withdraw(Long accountId,DepositWithdrawRequest request){
        Account account = accountService.findAndVerifyOwnership(accountId);

        if(account.getBalance().compareTo(request.getAmount())<0){
            throw new InsufficientFundsException("Insuffient funds. Current balance: "+account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction txn = Transaction.builder()
                .account(account)
                .type("WITHDRAWAL")
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription())
                .build();

        return mapToResponse(transactionRepository.save(txn));
    }

    // ---- TRANSFER ----
    @Transactional
    public TransactionResponse transfer(Long fromAccountId, TransferRequest request){
        Account fromAccount = accountService.findAndVerifyOwnership(fromAccountId);

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber()).orElseThrow(()-> new RuntimeException("Destination account not found"));

        if(fromAccount.getAccountNumber().equals(toAccount.getAccountNumber())){
            throw new RuntimeException("Cannot transfer to the same account");
        }

        if(fromAccount.getBalance().compareTo(request.getAmount())<0){
            throw new InsufficientFundsException("Insufficient funds.");
        }

        // Debit sender
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(fromAccount);

        // Credit receiver
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
        accountRepository.save(toAccount);

        // Record DEBIT transaction for sender
        Transaction debit = Transaction.builder()
                .account(fromAccount)
                .type("TRANSFER")
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Transfer to "+ toAccount.getAccountNumber())
                .relatedAccount(toAccount.getId())
                .build();

        Transaction credit = Transaction.builder()
                .account(toAccount)
                .type("TRANSFER")
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Transfer from "+ fromAccount.getAccountNumber())
                .relatedAccount(fromAccount.getId())
                .build();

        transactionRepository.save(debit);
        transactionRepository.save(credit);

        return mapToResponse(debit);
    }

    public List<TransactionResponse> getHistory(Long accountId){
        accountService.findAndVerifyOwnership(accountId);
        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .type(txn.getType())
                .amount(txn.getAmount())
                .balanceAfter(txn.getBalanceAfter())
                .description(txn.getDescription())
                .relatedAccount(txn.getRelatedAccount())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}
