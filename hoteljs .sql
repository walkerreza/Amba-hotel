-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 19, 2024 at 03:41 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hoteljs`
--

-- --------------------------------------------------------

--
-- Table structure for table `bukti_pembayarans`
--

CREATE TABLE `bukti_pembayarans` (
  `id` int NOT NULL,
  `pembayaran_id` int NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `payment_details` text,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gambars`
--

CREATE TABLE `gambars` (
  `id` int NOT NULL,
  `gambar_preview` varchar(255) NOT NULL,
  `gambar_kamar` varchar(255) NOT NULL,
  `gambar_fasilitas` varchar(255) NOT NULL,
  `gambar_lokasi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gambars`
--

INSERT INTO `gambars` (`id`, `gambar_preview`, `gambar_kamar`, `gambar_fasilitas`, `gambar_lokasi`) VALUES
(9, 'gambar_preview-1734579306985-596696691.jpg', 'gambar_kamar-1734579307006-306125404.jpg', 'gambar_fasilitas-1734579307015-904313826.jpg', 'gambar_lokasi-1734579307017-374061937.jpeg'),
(10, 'gambar_preview-1734579344039-661889799.jpg', 'gambar_kamar-1734579344040-748525058.jpg', 'gambar_fasilitas-1734579344043-273990430.jpg', 'gambar_lokasi-1734579344049-26793003.jpeg'),
(11, 'gambar_preview-1734579387155-657749404.jpg', 'gambar_kamar-1734579387155-893667494.jpg', 'gambar_fasilitas-1734579387155-761017389.jpg', 'gambar_lokasi-1734579387157-322090918.jpeg'),
(12, 'gambar_preview-1734579442042-785660428.jpeg', 'gambar_kamar-1734579442043-66126769.jpg', 'gambar_fasilitas-1734579442047-647919593.jpg', 'gambar_lokasi-1734579442049-733296282.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `kamars`
--

CREATE TABLE `kamars` (
  `id` int NOT NULL,
  `nomor_kamar` varchar(255) NOT NULL,
  `tipe_kamar` varchar(255) NOT NULL,
  `harga_per_malam` decimal(10,0) NOT NULL,
  `status_kamar` enum('tersedia','dipesan') DEFAULT 'tersedia',
  `gambar_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kamars`
--

INSERT INTO `kamars` (`id`, `nomor_kamar`, `tipe_kamar`, `harga_per_malam`, `status_kamar`, `gambar_id`, `created_at`, `updated_at`) VALUES
(1, '1', 'standart', '10000000', 'tersedia', 9, '2024-12-01 09:36:52', '2024-12-19 03:38:44'),
(2, '2', 'premium', '2000000', 'tersedia', 10, '2024-12-01 13:27:02', '2024-12-19 03:38:31'),
(3, '3', 'luxury', '11111', 'tersedia', 11, '2024-12-01 13:36:17', '2024-12-19 03:38:58'),
(4, '4', 'vip', '100000', 'dipesan', 12, '2024-12-02 02:13:40', '2024-12-19 03:39:05'),
(5, '5', 'vip', '2000000000', 'dipesan', 12, '2024-12-15 15:17:38', '2024-12-19 03:39:11');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `userId` int DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `type`, `description`, `userId`, `metadata`, `createdAt`, `updatedAt`) VALUES
(1, 'LOGIN', 'User login', NULL, '{\"path\": \"/api/user/login\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:33:12.407Z\", \"requestBody\": \"{\\\"username\\\":\\\"admin\\\",\\\"password\\\":\\\"admin\\\"}\"}', '2024-12-19 03:33:12', '2024-12-19 03:33:12'),
(2, 'LOGIN', 'User admin melakukan login', 2, '{\"timestamp\": \"2024-12-19T03:33:18.623Z\"}', '2024-12-19 03:33:18', '2024-12-19 03:33:18'),
(3, 'LOGIN', 'User login', NULL, '{\"path\": \"/api/user/login\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:33:18.628Z\", \"requestBody\": \"{\\\"username\\\":\\\"admin\\\",\\\"password\\\":\\\"123456789\\\"}\"}', '2024-12-19 03:33:18', '2024-12-19 03:33:18'),
(4, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.139Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(5, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.183Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(6, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(7, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(8, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.269Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(9, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.272Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(10, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.279Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(11, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.263Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(12, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(13, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.325Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(14, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(15, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.331Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(16, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.336Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(17, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.363Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(18, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(19, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(20, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.387Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(21, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.390Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(22, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(23, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(24, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.421Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(25, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:19.424Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:19', '2024-12-19 03:33:19'),
(26, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.418Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(27, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.477Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(28, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(29, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.488Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(30, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.502Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(31, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(32, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.519Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(33, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.532Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(34, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(35, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.546Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(36, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(37, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.563Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(38, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:23.566Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:23', '2024-12-19 03:33:23'),
(39, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(40, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.346Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(41, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.350Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(42, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.365Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(43, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.376Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(44, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(45, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.400Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(46, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.413Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(47, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.417Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(48, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(49, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.438Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(50, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(51, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.455Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(52, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.462Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(53, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(54, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.489Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(55, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.496Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(56, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(57, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.516Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(58, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.518Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(59, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:26.539Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:26', '2024-12-19 03:33:26'),
(60, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:27.957Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(61, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(62, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:27.974Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(63, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:27.979Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(64, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(65, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:27.998Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:27', '2024-12-19 03:33:27'),
(66, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.005Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(67, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.018Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(68, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(69, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.042Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(70, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(71, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.050Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(72, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.053Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(73, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(74, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.075Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(75, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(76, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:28.092Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:28', '2024-12-19 03:33:28'),
(77, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:30.966Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:30', '2024-12-19 03:33:30'),
(78, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(79, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.014Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(80, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(81, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.022Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(82, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.029Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(83, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.033Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(84, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.066Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(85, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(86, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(87, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.077Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(88, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.081Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(89, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:31.096Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:31', '2024-12-19 03:33:31'),
(90, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.234Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(91, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(92, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.239Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(93, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(94, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.248Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(95, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.252Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(96, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.264Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(97, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(98, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(99, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.288Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(100, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:33:33.292Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:33:33', '2024-12-19 03:33:33'),
(101, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.606Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(102, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(103, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(104, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.677Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(105, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.688Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(106, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.691Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(107, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.693Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(108, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.721Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(109, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(110, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(111, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.737Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(112, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.746Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(113, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:26.756Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:26', '2024-12-19 03:37:26'),
(114, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/5\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:37:41.377Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"1\\\",\\\"tipe_kamar\\\":\\\"vip\\\",\\\"harga_per_malam\\\":2000000000,\\\"status_kamar\\\":\\\"dipesan\\\",\\\"gambar_id\\\":\\\"12\\\"}\"}', '2024-12-19 03:37:41', '2024-12-19 03:37:41'),
(115, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:41.440Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:41', '2024-12-19 03:37:41'),
(116, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/4\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:37:53.946Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"3\\\",\\\"tipe_kamar\\\":\\\"vip\\\",\\\"harga_per_malam\\\":100000,\\\"status_kamar\\\":\\\"dipesan\\\",\\\"gambar_id\\\":\\\"12\\\"}\"}', '2024-12-19 03:37:53', '2024-12-19 03:37:53'),
(117, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:37:54.010Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:37:54', '2024-12-19 03:37:54'),
(118, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/3\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:38:10.935Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"2\\\",\\\"tipe_kamar\\\":\\\"luxury\\\",\\\"harga_per_malam\\\":11111,\\\"status_kamar\\\":\\\"tersedia\\\",\\\"gambar_id\\\":\\\"11\\\"}\"}', '2024-12-19 03:38:10', '2024-12-19 03:38:10'),
(119, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:38:11.021Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:38:11', '2024-12-19 03:38:11'),
(120, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/2\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:38:31.282Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"2\\\",\\\"tipe_kamar\\\":\\\"premium\\\",\\\"harga_per_malam\\\":2000000,\\\"status_kamar\\\":\\\"tersedia\\\",\\\"gambar_id\\\":\\\"10\\\"}\"}', '2024-12-19 03:38:31', '2024-12-19 03:38:31'),
(121, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:38:31.338Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:38:31', '2024-12-19 03:38:31'),
(122, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/1\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:38:44.637Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"1\\\",\\\"tipe_kamar\\\":\\\"standart\\\",\\\"harga_per_malam\\\":10000000,\\\"status_kamar\\\":\\\"tersedia\\\",\\\"gambar_id\\\":\\\"9\\\"}\"}', '2024-12-19 03:38:44', '2024-12-19 03:38:44'),
(123, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:38:44.710Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:38:44', '2024-12-19 03:38:44'),
(124, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/3\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:38:58.227Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"3\\\",\\\"tipe_kamar\\\":\\\"luxury\\\",\\\"harga_per_malam\\\":11111,\\\"status_kamar\\\":\\\"tersedia\\\",\\\"gambar_id\\\":11}\"}', '2024-12-19 03:38:58', '2024-12-19 03:38:58'),
(125, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:38:58.291Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:38:58', '2024-12-19 03:38:58'),
(126, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/4\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:39:05.393Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"4\\\",\\\"tipe_kamar\\\":\\\"vip\\\",\\\"harga_per_malam\\\":100000,\\\"status_kamar\\\":\\\"dipesan\\\",\\\"gambar_id\\\":12}\"}', '2024-12-19 03:39:05', '2024-12-19 03:39:05'),
(127, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:05.459Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:05', '2024-12-19 03:39:05'),
(128, 'UPDATE', 'Mengubah data kamar', 2, '{\"path\": \"/api/kamar/5\", \"method\": \"PUT\", \"timestamp\": \"2024-12-19T03:39:11.942Z\", \"requestBody\": \"{\\\"nomor_kamar\\\":\\\"5\\\",\\\"tipe_kamar\\\":\\\"vip\\\",\\\"harga_per_malam\\\":2000000000,\\\"status_kamar\\\":\\\"dipesan\\\",\\\"gambar_id\\\":12}\"}', '2024-12-19 03:39:11', '2024-12-19 03:39:11'),
(129, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:12.014Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:12', '2024-12-19 03:39:12'),
(130, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.183Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(131, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(132, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.217Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(133, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.244Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(134, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.263Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(135, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(136, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.282Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(137, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.272Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(138, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.296Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(139, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(140, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.311Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(141, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.332Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(142, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(143, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.349Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(144, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(145, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.369Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(146, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.375Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(147, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(148, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.407Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(149, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.419Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(150, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:15.437Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:15', '2024-12-19 03:39:15'),
(151, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.020Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(152, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(153, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.070Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(154, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.089Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(155, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.121Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(156, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(157, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(158, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.133Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(159, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.136Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(160, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.139Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(161, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.156Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(162, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(163, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(164, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.181Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(165, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.184Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(166, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(167, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.201Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(168, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(169, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.920Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(170, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.924Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(171, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.942Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(172, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.951Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(173, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(174, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.981Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(175, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(176, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.987Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(177, 'READ', 'Mengambil data user untuk dropdown', 2, '{\"path\": \"/api/user/dropdown\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.990Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(178, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:16.996Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:16', '2024-12-19 03:39:16'),
(179, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.019Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(180, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(181, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(182, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.041Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(183, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.051Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(184, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.059Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(185, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(186, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.087Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(187, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.089Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(188, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.101Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(189, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.891Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(190, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(191, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.951Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(192, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(193, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.966Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(194, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.968Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(195, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:17.972Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:17', '2024-12-19 03:39:17'),
(196, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:18.003Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(197, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(198, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(199, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:18.014Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(200, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:18.017Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(201, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:18.031Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:18', '2024-12-19 03:39:18'),
(202, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.035Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(203, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(204, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.041Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(205, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(206, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.050Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(207, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.054Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(208, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.079Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(209, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(210, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(211, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.103Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(212, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:19.106Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:19', '2024-12-19 03:39:19'),
(213, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.414Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(214, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(215, 'READ', 'Melihat daftar pembayaran', 2, '{\"path\": \"/api/pembayaran\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.478Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(216, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.485Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(217, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(218, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.500Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(219, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.512Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(220, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.535Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(221, 'READ', 'Mengakses daftar reservasi', 2, '{\"count\": 0}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(222, 'READ', 'Mengakses daftar semua user', 2, '{\"count\": 13}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(223, 'READ', 'Melihat daftar reservasi', 2, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.555Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(224, 'READ', 'Melihat daftar user', 2, '{\"path\": \"/api/user\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.557Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(225, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:20.571Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:20', '2024-12-19 03:39:20'),
(226, 'LOGIN', 'User johnd12 melakukan login', 17, '{\"timestamp\": \"2024-12-19T03:39:37.720Z\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(227, 'LOGIN', 'User login', NULL, '{\"path\": \"/api/user/login\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:39:37.728Z\", \"requestBody\": \"{\\\"username\\\":\\\"johnd12\\\",\\\"password\\\":\\\"Password123*\\\"}\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(228, 'UPDATE', 'Update status reservasi expired', 17, '{\"path\": \"/api/reservasi/update-expired\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:39:37.881Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(229, 'READ', 'Melihat kamar tersedia', NULL, '{\"path\": \"/api/kamar/available/2024-12-19\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:37.976Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(230, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:37.866Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(231, 'READ', 'Mengakses daftar reservasi', 17, '{\"count\": 0}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(232, 'UPDATE', 'Update status reservasi expired', 17, '{\"path\": \"/api/reservasi/update-expired\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:39:37.966Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:37', '2024-12-19 03:39:37'),
(233, 'READ', 'Melihat daftar reservasi', 17, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.019Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(234, 'READ', 'Melihat riwayat pembayaran user', 17, '{\"path\": \"/api/pembayaran/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.032Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(235, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.022Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(236, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.069Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(237, 'READ', 'Melihat kamar tersedia', NULL, '{\"path\": \"/api/kamar/available/2024-12-19\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.083Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(238, 'READ', 'Mengakses daftar reservasi', 17, '{\"count\": 0}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(239, 'READ', 'Melihat riwayat pembayaran user', 17, '{\"path\": \"/api/pembayaran/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.099Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(240, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.117Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(241, 'READ', 'Melihat daftar reservasi', 17, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.121Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(242, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.163Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(243, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:38.179Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:38', '2024-12-19 03:39:38'),
(244, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:42.156Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:42', '2024-12-19 03:39:42'),
(245, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:42.182Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:42', '2024-12-19 03:39:42'),
(246, 'UPDATE', 'Update status reservasi expired', 17, '{\"path\": \"/api/reservasi/update-expired\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:39:44.008Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(247, 'UPDATE', 'Update status reservasi expired', 17, '{\"path\": \"/api/reservasi/update-expired\", \"method\": \"POST\", \"timestamp\": \"2024-12-19T03:39:44.017Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(248, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.030Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(249, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.036Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(250, 'READ', 'Mengakses daftar reservasi', 17, '{\"count\": 0}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(251, 'READ', 'Melihat daftar reservasi', 17, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.069Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(252, 'READ', 'Melihat riwayat pembayaran user', 17, '{\"path\": \"/api/pembayaran/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.085Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(253, 'READ', 'Melihat daftar kamar', NULL, '{\"path\": \"/api/kamar\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.123Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(254, 'READ', 'Melihat kamar tersedia', NULL, '{\"path\": \"/api/kamar/available/2024-12-19\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.129Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(255, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.200Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(256, 'READ', 'Mengakses daftar reservasi', 17, '{\"count\": 0}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(257, 'READ', 'Melihat riwayat pembayaran user', 17, '{\"path\": \"/api/pembayaran/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.223Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(258, 'READ', 'Melihat daftar reservasi', 17, '{\"path\": \"/api/reservasi\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.232Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(259, 'READ', 'Melihat kamar tersedia', NULL, '{\"path\": \"/api/kamar/available/2024-12-19\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.268Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44'),
(260, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.305Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44');
INSERT INTO `logs` (`id`, `type`, `description`, `userId`, `metadata`, `createdAt`, `updatedAt`) VALUES
(261, 'READ', 'Melihat daftar reservasi berdasarkan user ID', 17, '{\"path\": \"/api/reservasi/user/17\", \"method\": \"GET\", \"timestamp\": \"2024-12-19T03:39:44.393Z\", \"requestBody\": \"{}\"}', '2024-12-19 03:39:44', '2024-12-19 03:39:44');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` enum('RESERVASI','PEMBAYARAN') NOT NULL,
  `isRead` tinyint(1) DEFAULT '0',
  `userId` int DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayarans`
--

CREATE TABLE `pembayarans` (
  `id` int NOT NULL,
  `reservasi_id` int NOT NULL,
  `jumlah` decimal(10,0) NOT NULL,
  `metode_pembayaran` enum('transfer','kartu kredit','cash') NOT NULL,
  `status_pembayaran` enum('pending','sukses','gagal') DEFAULT 'pending',
  `tanggal_pembayaran` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservasis`
--

CREATE TABLE `reservasis` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `kamar_id` int NOT NULL,
  `tanggal_checkin` datetime NOT NULL,
  `tanggal_checkout` datetime NOT NULL,
  `status_reservasi` enum('dipesan','dibatalkan','selesai') DEFAULT 'dipesan',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ulasans`
--

CREATE TABLE `ulasans` (
  `id` int NOT NULL,
  `id_user` int NOT NULL,
  `id_kamar` int NOT NULL,
  `rating` int NOT NULL,
  `ulasan` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`, `photo_url`) VALUES
(2, 'admin', 'admin@gmail.com', '$2b$10$oO3PtNXzMj8y/IIqDG/3Eu2WJDUdhq6ni7MyiRFati0DTwYD4/DeC', 'admin', '2024-12-01 06:38:05', '2024-12-01 06:38:05', '/uploads/profiles/profile-1734248929989-373550105.jpg'),
(3, 'reza', 'walkerreza999@gmail.com', '$2b$10$NQacGe6shmdXS/86FQQJseD2Ntguc/Au91OEy0DuZBOB53uO51UMm', 'user', '2024-12-01 06:53:51', '2024-12-15 07:45:21', '/uploads/profiles/profile-1734280187071-288595794.jpg'),
(4, 'alfangoldenboy', 'alfangdb@gmail.com', '$2b$10$QVTlX1llwQe6viHh4kqqZuoaqaqzg0SbYP94TPMoQkN0r6LJT/88C', 'user', '2024-12-05 07:34:39', '2024-12-05 07:34:39', NULL),
(5, 'mas niga', 'sholeh@yahoo.com', '$2b$10$xeI50/64tfQGvSflDmdodOCsp7fxeKsW6vKfn8YLdZ8SRVAezi52G', 'user', '2024-12-14 08:54:34', '2024-12-14 08:54:34', NULL),
(7, 'rezaaaa', 'shossleh@yahoo.com', '$2b$10$asc4cGNr/ZolgrKMYEhxZuIe1RMnytvm/8qW0FWzi7XPAJP5.tvhG', 'user', '2024-12-14 09:21:54', '2024-12-14 09:21:54', NULL),
(8, 'asep', 'asep@gmail.com', '$2b$10$9T4MMr0TNcHGQe5ARVhwQ.qz84Zhl3qi8vTl1LiugpwJNyIRsAFaa', 'user', '2024-12-14 09:23:39', '2024-12-14 09:23:39', NULL),
(9, 'user', 'user@gmail.com', '$2b$10$KKuBBxcTO5WppYq9tnyZTu5najK.21JdfT.P5jNlgXPE6kK63.p8y', 'user', '2024-12-15 08:01:38', '2024-12-15 08:01:38', NULL),
(11, 'azer', 'ragil@gmail.com', '$2b$10$nHGPUYGzGXQMMmlNuU4e5.Dyw5Lx.1G2kUfFci8UcVDCUMSrYZm4K', 'user', '2024-12-15 10:42:30', '2024-12-15 10:42:30', NULL),
(12, 'asas', 'assss@gmail.com', '$2b$10$YFBNdUkNh8a4.Nvztr8zjOkCipDa.pWZs7d4.lrwYD4RpWgtBbIi.', 'user', '2024-12-15 10:47:11', '2024-12-15 10:47:11', NULL),
(13, 'wawan1', 'wawan01@gmail.com', '$2b$10$8v3i67/nRb//jtLk9qcPSOVhK8cYVKZ6.0qy5iuWRZoU/Hw8uAxNe', 'user', '2024-12-15 10:56:15', '2024-12-15 10:56:15', NULL),
(14, 'user1', 'user1@gmail.com', '$2b$10$5Lug/yOTyVA5JgfAFOluDeVrO38X024YnwxxTq7iuQaEGvhDQgq8W', 'user', '2024-12-15 15:42:25', '2024-12-15 15:42:25', NULL),
(17, 'johnd12', 'aze12r@gmail.com', '$2b$10$Mt8s17y1ZoTGQQ9H1wDS8u.HA1dQjEoOmDrLAaVs1obc7oGPuEJxO', 'user', '2024-12-18 04:09:35', '2024-12-18 04:09:35', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bukti_pembayarans`
--
ALTER TABLE `bukti_pembayarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayaran_id` (`pembayaran_id`);

--
-- Indexes for table `gambars`
--
ALTER TABLE `gambars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kamars`
--
ALTER TABLE `kamars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gambar_id` (`gambar_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reservasi_id` (`reservasi_id`);

--
-- Indexes for table `reservasis`
--
ALTER TABLE `reservasis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `kamar_id` (`kamar_id`);

--
-- Indexes for table `ulasans`
--
ALTER TABLE `ulasans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_kamar` (`id_kamar`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bukti_pembayarans`
--
ALTER TABLE `bukti_pembayarans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gambars`
--
ALTER TABLE `gambars`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kamars`
--
ALTER TABLE `kamars`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayarans`
--
ALTER TABLE `pembayarans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservasis`
--
ALTER TABLE `reservasis`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ulasans`
--
ALTER TABLE `ulasans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bukti_pembayarans`
--
ALTER TABLE `bukti_pembayarans`
  ADD CONSTRAINT `bukti_pembayarans_ibfk_1` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kamars`
--
ALTER TABLE `kamars`
  ADD CONSTRAINT `kamars_ibfk_1` FOREIGN KEY (`gambar_id`) REFERENCES `gambars` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD CONSTRAINT `pembayarans_ibfk_1` FOREIGN KEY (`reservasi_id`) REFERENCES `reservasis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservasis`
--
ALTER TABLE `reservasis`
  ADD CONSTRAINT `reservasis_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservasis_ibfk_4` FOREIGN KEY (`kamar_id`) REFERENCES `kamars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ulasans`
--
ALTER TABLE `ulasans`
  ADD CONSTRAINT `ulasans_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ulasans_ibfk_2` FOREIGN KEY (`id_kamar`) REFERENCES `kamars` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
