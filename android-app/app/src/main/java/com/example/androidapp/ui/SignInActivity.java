package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.ViewModelProvider;

import com.example.androidapp.R;
import com.example.androidapp.ui.home.HomeActivity;
import com.example.androidapp.viewmodel.SignInViewModel;
import com.google.android.material.button.MaterialButton;

public class SignInActivity extends AppCompatActivity {

    private SignInViewModel signInViewModel;
    private EditText nameInput;
    private EditText passwordInput;
    private MaterialButton signInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_in);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);


        // ViewModel
        signInViewModel = new ViewModelProvider(this).get(SignInViewModel.class);

        // Back arrow button
        findViewById(R.id.btnBackArrow).setOnClickListener(v -> {
            finish();
        });

        // Form fields
        nameInput = findViewById(R.id.etName);
        passwordInput = findViewById(R.id.etPassword);
        signInButton = findViewById(R.id.btnSignIn);
        handleSignIn();

        // Observe sign in status
        observeViewModel();
    }

    void handleSignIn() {
        signInButton.setOnClickListener(v -> {
            String name = nameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            if (name.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
            } else {
                signInViewModel.signIn(name, password);
            }
        });
    }

    private void observeViewModel() {
        // Observe errors
        signInViewModel.getErrorMessage().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });

        // Observe sign in status
        signInViewModel.getIsSignedIn().observe(this, isSignedIn -> {
            if (isSignedIn) {
                Intent intent = new Intent(SignInActivity.this, HomeActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish();
            }
        });
    }
}