package com.example.androidapp.data.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;

import com.example.androidapp.data.model.entity.User;

import java.util.List;

@Dao
public interface UserDao {
    @Insert
    void insert(User user);

    @Query("SELECT * FROM users")
    LiveData<User> get();

    @Query("DELETE FROM users")
    void delete();

    @Query("SELECT * FROM users LIMIT 1")
    LiveData<User> getUser();
}
