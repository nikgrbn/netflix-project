package com.example.androidapp.viewmodel;

import android.app.Application;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.androidapp.data.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

public class SignUpViewModel extends AndroidViewModel {
    private final UserRepository userRepository;
    private LiveData<Boolean> isSignedUp;
    private MutableLiveData<String> errorMessage;

    public SignUpViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application);
        isSignedUp = userRepository.getIsSignedUp();
        errorMessage = userRepository.getErrorMessage();
    }

    public LiveData<Boolean> getIsSignedUp() {
        return isSignedUp;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void signUp(String username, String password, String confirmPassword, String displayName, Uri selectedImageUri) {
        if (username == null || username.isEmpty()) {
            errorMessage.postValue("Username cannot be empty.");
            return;
        }

        if (password == null || password.isEmpty() || password.length() < 4 || password.length() > 60) {
            errorMessage.postValue("Password must have 4-60 characters.");
            return;
        }

        if (!password.equals(confirmPassword)) {
            errorMessage.postValue("Passwords do not match.");
            return;
        }

        if (displayName == null || displayName.isEmpty()) {
            errorMessage.postValue("Display name cannot be empty.");
            return;
        }

        userRepository.signUp(username, password, displayName, selectedImageUri);
    }

}
