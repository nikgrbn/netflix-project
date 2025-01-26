package com.example.androidapp.data.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.example.androidapp.data.model.entity.Category;
import com.example.androidapp.data.model.entity.Movie;

import java.util.List;

@Dao
public interface MovieDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertMovies(List<Movie> movies);

    @Query("SELECT * FROM movies ORDER BY RANDOM() LIMIT 1")
    Movie getRandomMovieSync();

    @Query("SELECT * FROM movies WHERE id = :id")
    LiveData<Movie> getMovieById(int id);
  
    @Query("SELECT * FROM movies WHERE categories LIKE '%\"id\":' || :categoryId || ',%' OR categories LIKE '%\"id\":' || :categoryId || ']%'")
    List<Movie> getMoviesByCategory(int categoryId);

    @Query("DELETE FROM movies WHERE id = :movieId")
    void deleteMovieById(int movieId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertMovie(Movie movie); // Add a single movie




}