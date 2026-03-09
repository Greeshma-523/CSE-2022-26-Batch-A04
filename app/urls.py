# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.users_list, name='users_list'),
    path('users/login/', views.user_login, name='user_login'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
    path('uploadfile/', views.upload_file, name='uploadfile_api'),
    path('view_files/<str:email>/', views.view_files, name='view_files'),
    path('decrypt_file/<int:id>/', views.decrypt_file, name='decrypt_file'),
    path('view_decrypted_file/<str:email>/', views.view_decrypted_file, name='view_decrypted_file'),
    path('download/<int:id>/', views.download, name='download_file'),
    path('viewallfiles/', views.view_all_files, name='view_all_files'),
    path('cloudlogin/', views.cloud_login, name='cloud_login_api'),
    path('viewusers/', views.view_users, name='view_users_api'),
    path('authorize/<int:id>/', views.authorize, name='authorize_user'),
    path('unauthorize/<int:id>/', views.unauthorize, name='unauthorize_user'),
]