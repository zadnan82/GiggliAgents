"""
Generate secure secret keys for .env file
"""

import secrets
import string


def generate_secret(length=64):
    """Generate a secure random secret"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return "".join(secrets.choice(alphabet) for _ in range(length))


if __name__ == "__main__":
    print("🔐 Generated Secret Keys for .env file:\n")
    print(f"SECRET_KEY={generate_secret()}")
    print(f"JWT_SECRET_KEY={generate_secret()}")
    print("\n⚠️  IMPORTANT: Keep these keys secure and never commit to git!")
