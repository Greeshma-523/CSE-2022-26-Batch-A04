from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

def encrypt_AES(plaintext, key):
    """
    Encrypts the plaintext using AES encryption in CBC mode.
    The IV is generated internally and prepended to the ciphertext.
    
    Args:
        plaintext (str): The text to encrypt.
        key (bytes): The encryption key (must be 16, 24, or 32 bytes long).

    Returns:
        bytes: The IV-prepended ciphertext.
    """
    # Convert plaintext to bytes
    data = plaintext.encode('utf-8')
    
    # Generate a random Initialization Vector (IV)
    iv = get_random_bytes(AES.block_size)
    
    # Create AES cipher object in CBC mode with the generated IV
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # Encrypt the padded plaintext
    ciphertext = cipher.encrypt(pad(data, AES.block_size))
    
    # Prepend IV to the ciphertext so it can be used during decryption
    return iv + ciphertext

def decrypt_AES(encrypted, key):
    """
    Decrypts the IV-prepended ciphertext using AES decryption in CBC mode.
    
    Args:
        encrypted (bytes): The IV-prepended ciphertext.
        key (bytes): The decryption key (must be the same as the encryption key).

    Returns:
        str: The decrypted plaintext.
    """
    # Extract the IV from the beginning of the encrypted data
    iv = encrypted[:AES.block_size]
    # The remaining bytes are the actual ciphertext
    ciphertext = encrypted[AES.block_size:]
    
    # Create AES cipher object in CBC mode using the extracted IV
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    # Decrypt and unpad the data
    decrypted_data = unpad(cipher.decrypt(ciphertext), AES.block_size)
    
    return decrypted_data.decode('utf-8')

if __name__ == "__main__":
    # Define the AES key (must be 16, 24, or 32 bytes long for AES-128, AES-192, or AES-256 respectively)
    key = get_random_bytes(16) 
    print(type(key), key)
    # Define the plaintext message
    message = "This is a secret message with IV used only in the algorithm! This is a secret message with IV used only in the algorithm! This is a secret message with IV used only in the algorithm!"
    
    # Encrypt the message
    encrypted_message = encrypt_AES(message, key)
    print(type(encrypted_message), encrypted_message)
    print("Encrypted Message (hex):", encrypted_message.hex())
    
    # Decrypt the message
    decrypted_message = decrypt_AES(encrypted_message, key)
    print("Decrypted Message:", decrypted_message)
