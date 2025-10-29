#!/bin/bash
set -euo pipefail

# === Config ===
# Detecta el path absoluto del proyecto (carpeta donde está el script)
ROOT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Ruta de tu build (ajústala si cambias el nombre del proyecto)
BUILD_DIR="$ROOT_DIR/dist/inmo.devilla/browser"

# Bucket S3
BUCKET_NAME="metatesisperu.com"

# Opcional: perfila/región si usas algo distinto al default
AWS_PROFILE="default"
AWS_REGION="us-east-1"

echo "🔎 Comprobando carpeta de build..."
echo "BUILD_DIR = $BUILD_DIR"
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ No existe la carpeta de build. ¿Ejecutaste 'ng build --configuration production'?"
  exit 1
fi

echo "📦 Contenido de build:"
ls -la "$BUILD_DIR" | head -n 30

echo "🔐 Comprobando acceso a S3..."
aws s3 ls "s3://$BUCKET_NAME" --profile "$AWS_PROFILE" --region "$AWS_REGION" >/dev/null

echo "🛰️ Sincronizando archivos con S3 (dry run):"
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --exact-timestamps \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --dryrun

echo "🚚 Subiendo archivos a S3..."
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --exact-timestamps \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION"

echo "✅ Deploy completado en S3: s3://$BUCKET_NAME"

# Archivos estáticos
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION"

# index.html
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION"

  #!/bin/bash

BUILD_DIR=dist/inmo.devilla/browser
BUCKET_NAME=metatesisperu.com
DISTRIBUTION_ID=ETQY64PGRAR3E

echo "🔹 Subiendo archivos a S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete

echo "🚀 Creando invalidación en CloudFront..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deploy completado con invalidación"
