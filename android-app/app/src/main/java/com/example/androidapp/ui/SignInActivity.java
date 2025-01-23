package com.example.androidapp.ui;

import android.os.Bundle;
import android.widget.EditText;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.androidapp.R;
import com.google.android.material.button.MaterialButton;

public class SignInActivity extends AppCompatActivity {

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

        // Back arrow button
        findViewById(R.id.btnBackArrow).setOnClickListener(v -> {
            finish();
        });

        // Form fields
        nameInput = findViewById(R.id.etName);
        passwordInput = findViewById(R.id.etPassword);
        signInButton = findViewById(R.id.btnSignIn);
    }
}