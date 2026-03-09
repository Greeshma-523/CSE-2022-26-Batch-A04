from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class UsersModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersModel
        fields = ['id', 'name', 'email', 'password', 'dob', 'gender', 'contact', 'address', 'profile', 'status']
        
        # Optional: If you want to exclude the password from the serialized data
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Create a new user instance, hashing the password before saving
        user = UsersModel.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],  # You might want to hash this in production
            dob=validated_data['dob'],
            gender=validated_data['gender'],
            contact=validated_data['contact'],
            address=validated_data['address'],
            profile=validated_data['profile'],
            status=validated_data['status'],
        )
        return user

    def update(self, instance, validated_data):
        # Update an existing user instance with the provided data
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.contact = validated_data.get('contact', instance.contact)
        instance.address = validated_data.get('address', instance.address)
        instance.profile = validated_data.get('profile', instance.profile)
        instance.status = validated_data.get('status', instance.status)
        
        instance.save()
        return instance

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        try:
            user = UsersModel.objects.get(email=email, status='Authorized')
        except UsersModel.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return data