package com.example.androidapp.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.data.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

public class SignInViewModel extends AndroidViewModel {

    private final UserRepository userRepository;
    private LiveData<Boolean> isSignedIn;
    private LiveData<String> errorMessage;

    public SignInViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application);
        isSignedIn = userRepository.getIsSignedIn();
        errorMessage = userRepository.getErrorMessage();
    }

    public LiveData<Boolean> getIsSignedIn() {
        return isSignedIn;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void signIn(String username, String password) {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", username);
        credentials.put("password", password);

        userRepository.signIn(credentials);
    }
}
