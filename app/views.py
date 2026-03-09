# myapp/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UsersModel
from .serializers import *
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .algorithm import *
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from pathlib import Path


@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'GET':
        users = UsersModel.objects.all()
        serializer = UsersModelSerializer(users, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = UsersModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This will call the create method
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    try:
        user = UsersModel.objects.get(pk=pk)
    except UsersModel.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if request.method == 'GET':
        serializer = UsersModelSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UsersModelSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()  # This will call the update method
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted"}, status=204)
    
@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        # Use the custom serializer to validate user credentials
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get the email and password
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            request.session['email'] = email

            print('====', request.session.get('email'))
            try:
                user = UsersModel.objects.get(email=email, password=password)
            except UsersModel.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            # Create JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Return the JWT token
            return Response({
                "message": "Login successful",
                "email":email,
                "access_token": access_token,
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def upload_file(request):
    if request.method == 'POST':
        
        try:
            # Get the filename and the file from the request data
            filename = request.data['filename']
            file = request.data['file']
            email = request.data['email']
            print(email)
            # Save the uploaded file to a temporary location
            temp_file_path = os.path.join('static', 'EncryptedFiles', file.name)
            with open(temp_file_path, 'wb') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)

            # Read the file content for encryption
            with open(temp_file_path, 'r') as f:
                message = f.read()

            # Generate AES encryption key and encrypt the message
            key = get_random_bytes(16)  # Generate a random 16-byte AES key
            encrypted_message = encrypt_AES(message, key)

            # Save the encrypted content back to the file
            with open(temp_file_path, 'wb') as f:
                f.write(encrypted_message)

            # Split the encrypted message into two parts (for storing in A_Cloud and B_Cloud)
            data = encrypted_message.hex()
            l = len(data)
            encmsg1 = data[:l // 2]
            encmsg2 = data[l // 2:]

            # Save the details in A_Cloud (first part of the encrypted data)
            ca = A_Cloud(
                email=email,  # Assuming the user is authenticated, otherwise use session data
                filename=filename,
                key=key,
                filedata=encmsg1,  # First half of the encrypted data
                file=temp_file_path
            )
            ca.save()

            # Save the second part of the encrypted data in B_Cloud
            cadata = A_Cloud.objects.get(id=ca.id)
            cb = B_Cloud(
                cloud=cadata,
                filedata=encmsg2  # Second half of the encrypted data
            )
            cb.save()

            # Return success response
            return Response({"message": "File uploaded and encrypted successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Handle errors during the file processing
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def view_files(request, email):
    try:
        # Get the logged-in user's email from the session or request (depending on your auth method)
        # This assumes the user is authenticated with JWT. Adjust if using session-based login.

        # Fetch files from B_Cloud related to the logged-in user's email
        files = B_Cloud.objects.filter(cloud__email=email)

        # Prepare the file data for the response
        file_data = [
            {
                'filename': file.cloud.filename,
                'filedata': file.filedata,
                'file_url': file.cloud.file.url,  # URL for the file, assuming you're serving static files
                'time':file.cloud.time,
                'status':file.cloud.status,
                'id':file.cloud.id,
                'file_extension': Path(file.cloud.filename).suffix
            }
            for file in files
        ]

        # Return the file data as a JSON response
        return Response({'files': file_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', 'GET'])
def decrypt_file(request, id):
    try:
        # Get the logged-in user's email (if using session or JWT-based authentication)
        # This assumes the user is authenticated using JWT, replace if using session-based auth.

        # Get the B_Cloud data based on the provided ID
        cbdata = get_object_or_404(B_Cloud, id=id)

        # Check if the file has already been decrypted
        if DecryptModel.objects.filter(data=cbdata).exists():
            return Response({"message": "File already decrypted."}, status=status.HTTP_200_OK)

        # Concatenate the encrypted parts of the message
        msg1 = bytes.fromhex(cbdata.cloud.filedata)
        msg2 = bytes.fromhex(cbdata.filedata)
        msg = msg1 + msg2

        # Decrypt the message using the stored key
        decrypted_message = decrypt_AES(msg, cbdata.cloud.key)

        # Store the decrypted data in the DecryptModel
        DecryptModel.objects.create(
            data=cbdata,
            decrypted_data=decrypted_message
        )

        c_data = A_Cloud.objects.get(id=id)
        c_data.status = 'Decrypted'
        c_data.save()

        # Return success response with decrypted content
        return Response({
            "message": "File decrypted successfully!",
            "decrypted_data": decrypted_message  # Showing decrypted content in the response
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def view_decrypted_file(request, email):
    try:
        # Get the logged-in user's email (using session-based or JWT authentication)
        # This assumes the user is authenticated using JWT. Adjust if using session-based auth.

        # Filter the DecryptModel to get all files decrypted by the logged-in user
        decrypted_files = DecryptModel.objects.filter(data__cloud__email=email)

        # Prepare the response data with decrypted file details
        file_data = [
            {
                'filename': file.data.cloud.filename,
                'decrypted_data': file.decrypted_data,
                'decryption_time': file.time,
                'id':file.id
            }
            for file in decrypted_files
        ]

        # Return the list of decrypted files
        return Response({'decrypted_files': file_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def download(request, id):
    try:
        # Fetch the DecryptModel object by its ID
        context = get_object_or_404(DecryptModel, id=id)

        # Get the decrypted data
        plain_data = context.decrypted_data

        # Get the file name from the related B_Cloud record
        file_name = context.data.cloud.filename.split('/')[-1]

        # Return the decrypted content as a downloadable file
        response = HttpResponse(plain_data, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'

        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def view_all_files(request):
    try:
        # Fetch all B_Cloud records
        data = B_Cloud.objects.all()

        # Prepare the response data (a list of filenames and related information)
        file_data = [
            {
                'filename': file.cloud.filename,
                'filedata': file.filedata,
                'file_url': file.cloud.file.url  # Assuming you're serving static files
            }
            for file in data
        ]

        # Return the list of files in the response
        return Response({'files': file_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def cloud_login(request):
    try:
        # Get the email and password from the request data
        email = request.data['email']
        password = request.data['password']
        
        # Check if the provided email and password match the hardcoded credentials
        if email == 'cloud@gmail.com' and password == 'cloud':
            # Generate JWT token
            return Response({
                'message': 'Cloud Login successful',
                'role': 'Cloud'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except KeyError:
        return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def view_users(request):
    try:
        users = UsersModel.objects.all()
        user_data = [
            {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'dob': user.dob,
                'gender': user.gender,
                'contact': user.contact,
                'address': user.address,
                'profile': user.profile.url if user.profile else None,
                'status': user.status,
                'is_authorized': user.is_authorized  # Add this field
            }
            for user in users
        ]
        return Response({'users': user_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def authorize(request, id):
    try:
        user = get_object_or_404(UsersModel, id=id)
        user.is_authorized = True
        user.status = 'Authorized'
        user.save()
        return Response({'message': 'User Authorized Successfully!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def unauthorize(request, id):
    try:
        user = get_object_or_404(UsersModel, id=id)
        user.is_authorized = False
        user.status = 'Un Authorized'
        user.save()
        return Response({'message': 'User Unauthorized Successfully!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)