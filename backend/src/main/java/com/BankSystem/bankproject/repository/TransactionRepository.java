package com.BankSystem.bankproject.repository;

import com.BankSystem.bankproject.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId);
}
