package com.example.androidapp.data.model.entity;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "categories")
public class Category {
    @SerializedName("id")
    @PrimaryKey
    public int id;

    @SerializedName("name")
    public String name;

    @SerializedName("promoted")
    public boolean promoted = false;

    public Category() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPromoted() {
        return promoted;
    }

    public void setPromoted(boolean promoted) {
        this.promoted = promoted;
    }
}

