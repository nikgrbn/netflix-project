package com.example.androidapp.ui;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.lifecycle.LiveData;

import com.example.androidapp.R;
import com.example.androidapp.data.model.entity.User;
import com.example.androidapp.db.AppDatabase;

public class LandingActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_landing);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);


        // Check if the user is already signed in
        checkSignedInUser();

        // Set up the sign-in button
        findViewById(R.id.btnSignIn).setOnClickListener(v -> {
            startActivity(new Intent(this, SignInActivity.class));
        });

        // Set up the sign-up button
        findViewById(R.id.btnSignUp).setOnClickListener(v -> {
            startActivity(new Intent(this, SignUpActivity.class));
        });
    }

    private void checkSignedInUser() {
        LiveData<User> liveUser = AppDatabase.getInstance(getApplicationContext()).userDao().get();

        liveUser.observe(this, user -> {
            if (user != null && user.getToken() != null && !user.getToken().isEmpty()) {
                // User is signed in, redirect to HomeActivity
                Intent intent = new Intent(LandingActivity.this, HomeActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
                finish();
            }
        });
    }
}