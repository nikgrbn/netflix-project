package com.example.androidapp.data.repository;

import android.app.Application;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.api.CategoryApi;
import com.example.androidapp.api.MovieApi;
import com.example.androidapp.api.RetrofitClient;
import com.example.androidapp.data.dao.MovieDao;
import com.example.androidapp.data.dao.UserDao;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.db.AppDatabase;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ConsoleRepository {
    private final MovieApi movieApi;

    private final CategoryApi categoryApi;
    private final MovieDao movieDao;
    private final UserDao userDao;

    MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    MutableLiveData<String> errorMessage = new MutableLiveData<>();
    MutableLiveData<Boolean> isDeleted = new MutableLiveData<>();

    public ConsoleRepository(Application application) {
        movieApi = RetrofitClient.getClient().create(MovieApi.class);
        movieDao = AppDatabase.getInstance(application).movieDao();
        userDao = AppDatabase.getInstance(application).userDao();
        categoryApi = RetrofitClient.getClient().create(CategoryApi.class);
    }

    public LiveData<User> getUser() {
        return userDao.getUser(); // Expose userLiveData from Room
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public LiveData<Boolean> isDeleted() {
        return isDeleted;
    }


    public LiveData<Boolean> deleteMovie(String token, int userId, int movieId) {
        isLoading.setValue(true); // Set loading state

        // Call the API to delete the movie
        movieApi.deleteMovie("Bearer " + token, userId, movieId).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                isLoading.postValue(false); // Stop loading state

                if (response.isSuccessful()) {
                    Log.d("MovieRepository", "Movie deleted successfully");
                    // Delete the movie from Room database
                    AppDatabase.databaseWriteExecutor.execute(() -> {
                        movieDao.deleteMovieById(movieId); // Call the DAO method to delete from Room
                    });
                    isDeleted.postValue(true); // Update LiveData to indicate success
                } else {
                    Log.e("MovieRepository", "Failed to delete movie: " + response.message());
                    errorMessage.postValue("Failed to delete movie: " + response.message());
                    isDeleted.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                isLoading.postValue(false); // Stop loading state
                Log.e("MovieRepository", "Error deleting movie", t);
                errorMessage.postValue("Error deleting movie: " + t.getMessage());
                isDeleted.postValue(false);
            }
        });

        return isDeleted;
    }

    public LiveData<Boolean> deleteCategory(String token, int userId, int categoryId) {
        isLoading.setValue(true); // Set loading state

        // Call the API to delete the movie
        categoryApi.deleteCategory("Bearer " + token, userId, categoryId).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                isLoading.postValue(false); // Stop loading state

                if (response.isSuccessful()) {
                    Log.d("CategoryRepository", "Category deleted successfully");
                    isDeleted.postValue(true); // Update LiveData to indicate success
                } else {
                    Log.e("CategoryRepository", "Failed to delete category: " + response.message());
                    errorMessage.postValue("Failed to delete category: " + response.message());
                    isDeleted.postValue(false);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                isLoading.postValue(false); // Stop loading state
                Log.e("Movie/CategoryRepository", "Error deleting movie/category", t);
                errorMessage.postValue("Error deleting movie/category: " + t.getMessage());
                isDeleted.postValue(false);
            }
        });

        return isDeleted;
    }

    public void resetIsDeleted() {
        isDeleted.setValue(null);
    }
}
