'use client';

import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Information Section */}
          <div>
            <div className="mb-6">
            <div style={{ position: 'relative', width: '100px', height: '50px' }}>
  <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
</div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400">Main</a></li>
              <li><a href="#" className="hover:text-green-400">Gallery</a></li>
              <li><a href="#" className="hover:text-green-400">Projects</a></li>
              <li><a href="#" className="hover:text-green-400">Certifications</a></li>
              <li><a href="#" className="hover:text-green-400">Contacts</a></li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacts</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className="mr-2" size={20} />
                <span>123 Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2" size={20} />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2" size={20} />
                <span>info@soliate.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Media</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-green-400">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-green-400">
                <Linkedin size={24} />
              </a>
              <a href="#" className="hover:text-green-400">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          © 2023 All Rights Reserved
        </div>
      </div>
      <style jsx>{`
        .glow-effect {
          box-shadow: 0 0 15px 5px rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </footer>
  )
}