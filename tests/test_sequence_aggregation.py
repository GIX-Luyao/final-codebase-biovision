import unittest

from beaver_id.cli import apply_sequence_aggregation


class TestSequenceAggregation(unittest.TestCase):
    def test_sequence_majority_present_stabilizes_species(self) -> None:
        rows = [
            {
                "image_path": "s1_1.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:00:00",
                "has_animal": True,
                "animal_type": "Mule and black-tailed deer",
                "animal_confidence": 0.7,
            },
            {
                "image_path": "s1_2.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:00:02",
                "has_animal": True,
                "animal_type": "Mule and black-tailed deer",
                "animal_confidence": 0.65,
            },
            # Drift on last shot (model says no animal).
            {
                "image_path": "s1_3.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:00:04",
                "has_animal": False,
                "animal_type": "No animal",
                "animal_confidence": 0.9,
            },
        ]
        apply_sequence_aggregation(rows, gap_seconds=6, low_conf=0.6, high_conf=0.8)

        self.assertEqual({r["sequence_presence"] for r in rows}, {"present"})
        self.assertEqual({r["sequence_species"] for r in rows}, {"Mule and black-tailed deer"})
        self.assertEqual(len({r["sequence_id"] for r in rows}), 1)

    def test_sequence_single_high_conf_keeps_present(self) -> None:
        rows = [
            {
                "image_path": "s2_1.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:10:00",
                "has_animal": False,
                "animal_type": "No animal",
                "animal_confidence": 0.2,
            },
            {
                "image_path": "s2_2.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:10:02",
                "has_animal": True,
                "animal_type": "Raccoon",
                "animal_confidence": 0.85,
            },
            {
                "image_path": "s2_3.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:10:04",
                "has_animal": False,
                "animal_type": "No animal",
                "animal_confidence": 0.2,
            },
        ]
        apply_sequence_aggregation(rows, gap_seconds=6, low_conf=0.6, high_conf=0.8)
        self.assertEqual({r["sequence_presence"] for r in rows}, {"present"})
        self.assertEqual({r["sequence_species"] for r in rows}, {"Raccoon"})

    def test_sequence_single_medium_conf_marks_possible_and_review(self) -> None:
        rows = [
            {
                "image_path": "s3_1.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:20:00",
                "has_animal": True,
                "animal_type": "Mink",
                "animal_confidence": 0.7,
            },
            {
                "image_path": "s3_2.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:20:02",
                "has_animal": False,
                "animal_type": "No animal",
                "animal_confidence": 0.2,
            },
            {
                "image_path": "s3_3.jpg",
                "overlay_location": "SITE_A",
                "exif_timestamp": "2025:01:01 12:20:04",
                "has_animal": False,
                "animal_type": "No animal",
                "animal_confidence": 0.2,
            },
        ]
        apply_sequence_aggregation(rows, gap_seconds=6, low_conf=0.6, high_conf=0.8)
        self.assertEqual({r["sequence_presence"] for r in rows}, {"possible"})
        self.assertEqual({r["sequence_flag_manual_review"] for r in rows}, {True})

