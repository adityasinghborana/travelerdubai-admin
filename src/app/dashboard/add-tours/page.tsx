'use client'
import Container from '@/app/ui/dashboard/container/Container';
import { AddCity, AddTourTypes, GetAllCities, GetAllImages, GetAllTourTypes, UploadImage } from '@/lib/services';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

// Define types for the form data
interface FormData {
  cityId: string;
  cityName: string;
  tourName: string;
  duration: string;
  departurePoint: string;
  reportingTime: string;
  tourLanguage: string;
  // imagePath: string; // removed image path from the state and created a new one
  cityTourTypeId: string;
  cityTourType: string;
  tourDescription: string;
  tourInclusion: string;
  tourShortDescription: string;
  whatsInThisTour: string;
  importantInformation: string;
  itenararyDescription: string;
  usefulInformation: string;
  faqDetails: string;
  childAge: string;
  infantAge: string;
  infantCount: string;
  isSlot: string;
  onlyChild: string;
  contractId: string;
  latitude: string;
  longitude: string;
  startTime: string;
  meal: string;
  googleMapUrl: string;
  tourExclusion: string;

  cutOffhrs: string;
}

const TourForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cityId: '',
    cityName: '',
    tourName: '',
    duration: '',
    departurePoint: '',
    reportingTime: '',
    tourLanguage: '',
    cityTourTypeId: '',
    cityTourType: '',
    tourDescription: '',
    tourInclusion: '',
    tourShortDescription: '',
    whatsInThisTour: '',
    importantInformation: '',
    itenararyDescription: '',
    usefulInformation: '',
    faqDetails: '',
    childAge: '',
    infantAge: '',
    infantCount: '',
    isSlot: '',
    onlyChild: '',
    contractId: '',
    latitude: '',
    longitude: '',
    startTime: '',
    meal: '',
    googleMapUrl: '',
    tourExclusion: '',
    cutOffhrs: '',
  });

  const [cities, setCities] = useState([
    { CityId: '0', CityName: 'No record found' }
  ])

  const [tourTypes, settTourTypes] = useState([
    { cityTourType: 'No record found' }
  ])

  const [customCity, setCustomCity] = useState<string>('');
  const [customTourType, setCustomTourType] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [availableImages, setAvailableImages] = useState<Image[]>([{ name: '1', url: 'image1.jpg' }]);

  const imagesPerPage = 6;
  const totalPages = Math.ceil(availableImages.length / imagesPerPage);

  const openModal = async () => {
      let allImages = await GetAllImages()
      setAvailableImages(allImages)
      setIsModalOpen(true);}

  const closeModal = () => setIsModalOpen(false);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const handleImageSelect = (url: string) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(url)
        ? prevSelectedImages.filter((image) => image !== url)
        : [...prevSelectedImages, url]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
      setUploadedImages((prevUploadedImages) => [...prevUploadedImages, ...filesArray]);
      console.log(uploadedImages)
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setUploadedImages((prevUploadedImages) => prevUploadedImages.filter((_, i) => i !== index));
  };

  const uploadNewImages = async () => {
    const formData = new FormData();
    uploadedImages.forEach((file) => {
      formData.append('image', file);
    });
    // selectedImages.forEach((url, index) => {
    //   formData.append(`selectedImage${index}`, url);
    // });
    uploadedImages.length > 0 && await UploadImage(formData)
    closeModal()
  }

  useEffect(() => {
    const getCitiesAndTourTypes = async () => {
      let cities = await GetAllCities();
      let tourTypes = await GetAllTourTypes();
      setCities(cities)
      settTourTypes(tourTypes)
    }

    getCitiesAndTourTypes()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.cityName === 'custom' && await AddCity(customCity)
    formData.cityTourType === 'custom' && await AddTourTypes(customTourType)
    console.log(formData);
  };

  return (
    <Container>
      <div className="bg-white p-8  shadow-md w-full rounded-3xl">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Create Tour</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-4'>
          <div className="mb-4">
            <label className="block text-gray-700">City Name</label>
            <select
              name="cityName"
              value={formData.cityName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 text-black rounded mt-1"
              required
            >
              <option value="" disabled>Select a city</option>
              {cities.map((city, i) => (
                <option key={i} value={city.CityId}>
                  {city.CityName}
                </option>
              ))}
              <option value="custom">Other</option>
            </select>
            {formData.cityName === 'custom' && (
              <input
                type="text"
                name="customCity"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                required
              />
            )}
          </div>

          {/* Tour Type Dropdown */}
          <div className="mb-4 text-black">
            <label className="block text-gray-700">Tour Type</label>
            <select
              name="cityTourType"
              value={formData.cityTourType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            >
              <option value="" disabled>Select a tour type</option>
              {tourTypes.map((type, i) => (
                <option key={i} value={type.cityTourType}>
                  {type.cityTourType}
                </option>
              ))}
              <option value="custom">Other</option>
            </select>
            {formData.cityTourType === 'custom' && (
              <input
                type="text"
                name="customTourType"
                value={customTourType}
                onChange={(e) => setCustomTourType(e.target.value)}
                placeholder="Enter tour type"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            )}
          </div>

          {/* Image Upload and Select */}

          <div className="mb-4">
            <label className="block text-gray-700">Images</label>
            <div onClick={openModal} className="w-full p-2 border border-gray-300 rounded mt-1 cursor-pointer">
              Select or Upload Images
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Select or Upload Images</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                      &times;
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {availableImages
                      .slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage)
                      .map((image) => (
                        <div key={image.name} className="relative">
                          <img
                            src={process.env.NEXT_PUBLIC_URL + image.url}
                            alt={image.name}
                            className={`w-full h-32 object-cover ${selectedImages.includes(image.url) ? 'border-4 border-blue-500' : 'border'
                              }`}
                            onClick={() => handleImageSelect(image.url)}
                          />
                          {selectedImages.includes(image.url) && (
                            <span className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-full">✓</span>
                          )}
                        </div>
                      ))}
                  </div>

                  {availableImages.length > imagesPerPage && (
                    <div className="flex justify-center items-center mt-4">
                      <button onClick={handlePrevPage} className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 mr-2">
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full mx-1 ${index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        />
                      ))}
                      <button onClick={handleNextPage} className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 ml-2">
                        &gt;
                      </button>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-gray-700">Upload New Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Uploaded ${index}`} className="w-full h-32 object-contain border" />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            onClick={() => handleRemoveImage(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => uploadNewImages()}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Other form fields */}
          {Object.keys(formData).map((key) => {
            if (key === 'cityName' || key === 'cityTourType' || key === 'cityId') return null;
            return (
              <div className="mb-4" key={key}>
                <label className="block text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key as keyof FormData]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                  required
                />
              </div>
            );
          })}
          <div></div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-purple-400 w-full"
            >
              Submit
            </button>
          </div>
          <div></div>
        </form>
      </div>
    </Container>
  );
};

interface Image {
  name: string;
  url: string;
}

export default TourForm;
