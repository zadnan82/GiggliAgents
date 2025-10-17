import os
import boto3
from botocore.exceptions import ClientError
from ..config import settings
from pathlib import Path


class StorageService:
    def __init__(self):
        self.use_s3 = settings.use_s3

        if self.use_s3:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
                region_name=settings.aws_region,
            )
            self.bucket = settings.aws_s3_bucket
        else:
            self.local_path = Path(settings.download_path)
            self.local_path.mkdir(parents=True, exist_ok=True)

    def get_download_url(
        self, platform: str, version: str = "1.0.0"
    ) -> tuple[str, dict]:
        """Get download URL for app package"""

        filename = self._get_filename(platform, version)

        if self.use_s3:
            return self._get_s3_url(filename)
        else:
            return self._get_local_url(filename, platform)

    def _get_filename(self, platform: str, version: str) -> str:
        """Generate filename based on platform"""
        extensions = {"windows": "exe", "macos": "dmg", "linux": "AppImage"}
        ext = extensions.get(platform, "zip")
        return f"GiggliAgents-{version}-{platform}.{ext}"

    def _get_s3_url(self, filename: str) -> tuple[str, dict]:
        """Generate S3 pre-signed URL"""
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": filename},
                ExpiresIn=3600,  # 1 hour
            )

            # Get file metadata
            response = self.s3_client.head_object(Bucket=self.bucket, Key=filename)
            size_mb = response["ContentLength"] / (1024 * 1024)

            metadata = {
                "size_mb": round(size_mb, 2),
                "last_modified": response["LastModified"].isoformat(),
                "etag": response["ETag"].strip('"'),
            }

            return url, metadata

        except ClientError as e:
            raise Exception(f"File not found in S3: {filename}")

    def _get_local_url(self, filename: str, platform: str) -> tuple[str, dict]:
        """Get local file URL"""
        file_path = self.local_path / platform / filename

        if not file_path.exists():
            raise Exception(f"File not found: {filename}")

        # Get file size
        size_mb = file_path.stat().st_size / (1024 * 1024)

        metadata = {
            "size_mb": round(size_mb, 2),
            "path": str(file_path),
            "filename": filename,
        }

        # Return API endpoint URL
        url = f"/api/downloads/file/{platform}/{filename}"

        return url, metadata

    def upload_file(self, file_path: str, platform: str):
        """Upload file to storage"""
        filename = Path(file_path).name

        if self.use_s3:
            try:
                self.s3_client.upload_file(
                    file_path,
                    self.bucket,
                    filename,
                    ExtraArgs={"ContentType": "application/octet-stream"},
                )
                print(f"✅ Uploaded {filename} to S3")
            except ClientError as e:
                raise Exception(f"Upload failed: {e}")
        else:
            dest_dir = self.local_path / platform
            dest_dir.mkdir(parents=True, exist_ok=True)

            import shutil

            shutil.copy2(file_path, dest_dir / filename)
            print(f"✅ Copied {filename} to {dest_dir}")


storage_service = StorageService()
