#!/bin/bash

################################################################################
# Portfolio Management System - CI/CD Installation Script
#
# This script automates the deployment process with automatic rollback on failure.
#
# Features:
# - Checks for GitHub updates
# - Runs git pull if updates are available
# - Installs new packages if needed
# - Builds the site
# - Restarts the site (using PM2 or systemd)
# - Automatic rollback to previous version if build fails
#
# Requirements:
# - Git repository must be initialized with proper remote
# - PM2 or systemd service configured for the application
# - Sufficient permissions to restart services
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="portfolio"
SERVICE_NAME="portfolio"  # Change this to match your PM2 app name or systemd service
BACKUP_DIR="/tmp/portfolio-backup"
LOG_FILE="/var/log/portfolio-deploy.log"

# Function to log messages
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "${LOG_FILE}"
}

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log "INFO" "$1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log "SUCCESS" "$1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log "WARNING" "$1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log "ERROR" "$1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PM2 is running
is_pm2_running() {
    command_exists pm2 && pm2 list | grep -q "${SERVICE_NAME}"
}

# Function to check if systemd service is running
is_systemd_running() {
    systemctl is-active --quiet "${SERVICE_NAME}.service" 2>/dev/null
}

# Function to stop the application
stop_app() {
    print_info "Stopping application..."
    
    if is_pm2_running; then
        pm2 stop "${SERVICE_NAME}" || print_warning "Failed to stop PM2 app"
    elif is_systemd_running; then
        systemctl stop "${SERVICE_NAME}" || print_warning "Failed to stop systemd service"
    else
        print_warning "No running application found (PM2 or systemd)"
    fi
}

# Function to start the application
start_app() {
    print_info "Starting application..."
    
    if command_exists pm2 && pm2 list | grep -q "${SERVICE_NAME}"; then
        pm2 start "${SERVICE_NAME}" || print_error "Failed to start PM2 app"
    elif systemctl list-unit-files | grep -q "${SERVICE_NAME}.service"; then
        systemctl start "${SERVICE_NAME}" || print_error "Failed to start systemd service"
    else
        print_error "No PM2 app or systemd service found for ${SERVICE_NAME}"
        return 1
    fi
}

# Function to restart the application
restart_app() {
    print_info "Restarting application..."
    
    if is_pm2_running; then
        pm2 restart "${SERVICE_NAME}" || print_error "Failed to restart PM2 app"
    elif is_systemd_running; then
        systemctl restart "${SERVICE_NAME}" || print_error "Failed to restart systemd service"
    else
        print_warning "No running application found, attempting to start..."
        start_app
    fi
}

# Function to create backup of current state
create_backup() {
    print_info "Creating backup of current state..."
    
    # Create backup directory
    mkdir -p "${BACKUP_DIR}"
    
    # Backup current git state
    if [ -d ".git" ]; then
        git rev-parse HEAD > "${BACKUP_DIR}/commit_hash.txt"
        print_info "Current commit: $(cat ${BACKUP_DIR}/commit_hash.txt)"
    fi
    
    # Backup node_modules if it exists
    if [ -d "node_modules" ]; then
        print_info "Backing up node_modules..."
        tar -czf "${BACKUP_DIR}/node_modules.tar.gz" node_modules/ || print_warning "Failed to backup node_modules"
    fi
    
    # Backup .next directory if it exists
    if [ -d ".next" ]; then
        print_info "Backing up .next directory..."
        tar -czf "${BACKUP_DIR}/next.tar.gz" .next/ || print_warning "Failed to backup .next directory"
    fi
    
    print_success "Backup created at ${BACKUP_DIR}"
}

# Function to restore from backup
restore_backup() {
    print_error "Build failed, restoring from backup..."
    
    # Restore git state
    if [ -f "${BACKUP_DIR}/commit_hash.txt" ]; then
        print_info "Restoring git state..."
        git reset --hard "$(cat ${BACKUP_DIR}/commit_hash.txt)" || print_error "Failed to restore git state"
    fi
    
    # Restore node_modules if backup exists
    if [ -f "${BACKUP_DIR}/node_modules.tar.gz" ]; then
        print_info "Restoring node_modules..."
        tar -xzf "${BACKUP_DIR}/node_modules.tar.gz" || print_warning "Failed to restore node_modules"
    fi
    
    # Restore .next directory if backup exists
    if [ -f "${BACKUP_DIR}/next.tar.gz" ]; then
        print_info "Restoring .next directory..."
        tar -xzf "${BACKUP_DIR}/next.tar.gz" || print_warning "Failed to restore .next directory"
    fi
    
    # Restart application with previous version
    restart_app
    
    print_success "Successfully restored to previous version"
    exit 1
}

# Function to check for updates
check_for_updates() {
    print_info "Checking for GitHub updates..."
    
    if [ ! -d ".git" ]; then
        print_warning "Not a git repository, skipping update check"
        return 1
    fi
    
    # Fetch latest changes
    git fetch origin || {
        print_error "Failed to fetch from remote"
        return 1
    }
    
    # Check if there are updates
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    BASE=$(git merge-base @ @{u})
    
    if [ "${LOCAL}" = "${REMOTE}" ]; then
        print_info "Already up to date"
        return 1
    elif [ "${LOCAL}" = "${BASE}" ]; then
        print_success "Updates available"
        return 0
    elif [ "${REMOTE}" = "${BASE}" ]; then
        print_warning "Local changes detected, please commit or stash them"
        return 1
    else
        print_warning "Local and remote have diverged"
        return 1
    fi
}

# Function to pull updates
pull_updates() {
    print_info "Pulling updates from GitHub..."
    
    git pull origin "$(git rev-parse --abbrev-ref HEAD)" || {
        print_error "Failed to pull updates"
        return 1
    }
    
    print_success "Successfully pulled updates"
}

# Function to install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    
    # Check if package.json has changed
    if [ -f "${BACKUP_DIR}/package.json" ]; then
        if ! diff -q package.json "${BACKUP_DIR}/package.json" >/dev/null 2>&1; then
            print_info "package.json has changed, installing new dependencies..."
            npm install || {
                print_error "Failed to install dependencies"
                return 1
            }
            print_success "Dependencies installed successfully"
        else
            print_info "No changes in package.json, skipping npm install"
        fi
    else
        print_info "No previous package.json backup, installing dependencies..."
        npm install || {
            print_error "Failed to install dependencies"
            return 1
        }
        print_success "Dependencies installed successfully"
    fi
    
    # Backup current package.json for next run
    cp package.json "${BACKUP_DIR}/package.json"
}

# Function to generate Prisma client
generate_prisma() {
    print_info "Generating Prisma client..."
    
    npm run prisma:generate || {
        print_error "Failed to generate Prisma client"
        return 1
    }
    
    print_success "Prisma client generated successfully"
}

# Function to run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    npx prisma migrate deploy || {
        print_error "Failed to run migrations"
        return 1
    }
    
    print_success "Database migrations completed successfully"
}

# Function to build the application
build_app() {
    print_info "Building application..."
    
    npm run build || {
        print_error "Build failed"
        return 1
    }
    
    print_success "Application built successfully"
}

# Main deployment function
deploy() {
    print_info "Starting deployment process..."
    
    # Create backup directory
    mkdir -p "${BACKUP_DIR}"
    
    # Check for updates
    if check_for_updates; then
        # Create backup before pulling updates
        create_backup
        
        # Pull updates
        pull_updates || restore_backup
        
        # Install dependencies if needed
        install_dependencies || restore_backup
        
        # Generate Prisma client
        generate_prisma || restore_backup
        
        # Run database migrations
        run_migrations || restore_backup
        
        # Build application
        build_app || restore_backup
        
        # Restart application
        restart_app || {
            print_error "Failed to restart application"
            restore_backup
        }
        
        print_success "Deployment completed successfully!"
    else
        print_info "No updates to deploy"
    fi
    
    # Clean up old backups (keep last 5)
    print_info "Cleaning up old backups..."
    ls -t "${BACKUP_DIR}"* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
}

# Trap errors and restore backup
trap 'print_error "Deployment failed with error"; restore_backup' ERR

# Run deployment
deploy

exit 0
